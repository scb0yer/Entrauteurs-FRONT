import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import("../src/assets/progression.css");
export default function Progression({ progress, target }) {
  const navigate = useNavigate();
  const [isloading, setIsloading] = useState(true);
  const [daysTab, setDaysTab] = useState(null);
  const [monthsTab, setMonthsTab] = useState([
    { month: "Janvier" },
    { month: "Fevrier" },
    { month: "Mars" },
    { month: "Avril" },
    { month: "Mai" },
    { month: "Juin" },
    { month: "Juillet" },
    { month: "Aout" },
    { month: "Septembre" },
    { month: "Octobre" },
    { month: "Novembre" },
    { month: "Decembre" },
  ]);
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const [daysLength, setDaysLength] = useState();
  const [display, setDisplay] = useState("month");
  const monthTarget = Math.floor((target * 365) / 12);

  useEffect(() => {
    const setDate = () => {
      const today = new Date();
      if (today.getMonth() + 1 === 1) {
        setMonth("Janvier");
      } else if (today.getMonth() + 1 === 2) {
        setMonth("Fevrier");
      } else if (today.getMonth() + 1 === 3) {
        setMonth("Mars");
      } else if (today.getMonth() + 1 === 4) {
        setMonth("Avril");
      } else if (today.getMonth() + 1 === 5) {
        setMonth("Mai");
      } else if (today.getMonth() + 1 === 6) {
        setMonth("Juin");
      } else if (today.getMonth() + 1 === 7) {
        setMonth("Juillet");
      } else if (today.getMonth() + 1 === 8) {
        setMonth("Aout");
      } else if (today.getMonth() + 1 === 9) {
        setMonth("Septembre");
      } else if (today.getMonth() + 1 === 10) {
        setMonth("Octobre");
      } else if (today.getMonth() + 1 === 11) {
        setMonth("Novembre");
      } else if (today.getMonth() + 1 === 12) {
        setMonth("Decembre");
      }
      setYear(today.getFullYear());
    };
    setDate();
  }, [progress]);

  useEffect(() => {
    for (let y = 0; y < progress.length; y++) {
      if (progress[y].year.index === year) {
        for (let m = 0; m < progress[y].year.months.length; m++) {
          if (month === "Fevrier") {
            setDaysLength(29);
          } else if (
            month === "Avril" ||
            month === "Juin" ||
            month === "Septembre" ||
            month === "Novembre"
          ) {
            setDaysLength(30);
          } else {
            setDaysLength(31);
          }
        }
      }
    }
  }, [year]);
  useEffect(() => {
    console.log("PROGRESS", progress);
    try {
      for (let y = 0; y < progress.length; y++) {
        if (progress[y].year.index === year) {
          const newMonthsTab = [...monthsTab];
          for (let m = 0; m < progress[y].year.months.length; m++) {
            let total = 0;
            for (let p = 0; p < progress[y].year.months[m].days.length; p++) {
              total += progress[y].year.months[m].days[p].count;
            }
            for (let i = 0; i < 12; i++) {
              if (progress[y].year.months[m].month === newMonthsTab[i].month) {
                newMonthsTab[i].count = total;
              }
            }
            if (progress[y].year.months[m].month === month) {
              const newDaysTab = [];
              for (let d = 1; d < daysLength + 1; d++) {
                let count = 0;
                for (
                  let p = 0;
                  p < progress[y].year.months[m].days.length;
                  p++
                ) {
                  if (progress[y].year.months[m].days[p].day === d) {
                    newDaysTab.push({
                      day: d,
                      count: progress[y].year.months[m].days[p].count,
                    });
                    count++;
                  }
                }
                if (count === 0) {
                  newDaysTab.push({ day: d, count: 0 });
                }
              }
              setDaysTab(newDaysTab);
            }
          }
          setMonthsTab(newMonthsTab);
          console.log("NEWMONTHTAB", newMonthsTab);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
    setIsloading(false);
  }, [daysLength]);

  return (
    <>
      {isloading && <div>En cours de chargement</div>}
      {!isloading && (
        <>
          <br />
          <div className="display-selector">
            <select
              name="display"
              onChange={(event) => {
                setDisplay(event.target.value);
              }}
            >
              <option value="month">Mois</option>
              <option value="year">Année</option>
            </select>
            <h3>
              {display === "month" ? `Mois de ${month}` : `Année ${year}`}
            </h3>
          </div>
          {display === "month" && daysTab && (
            <div className="progress-display">
              <div className="bars">
                {daysTab.map((day, index) => {
                  const percent = (day.count / target) * 200;
                  const large = 60 / daysLength;
                  return (
                    <div key={index}>
                      <div
                        style={{
                          position: percent > 400 ? "absolute" : "relative",
                          bottom: percent > 400 ? "380px" : "0px",
                          textAlign: "center",
                          color: !day.count ? "#1F2231" : "white",
                        }}
                      >
                        {day.count}
                      </div>
                      <div
                        className="progress-bar-days"
                        style={{
                          height: `${percent}px`,
                          width: `${large}vw`,
                          backgroundColor:
                            day.count > target ? "#c2830e" : "rgb(61, 61, 61)",
                        }}
                      ></div>
                      <div style={{ height: "20px", textAlign: "center" }}>
                        {day.day}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="target">{target}</div>
            </div>
          )}
          {display === "year" && monthsTab && (
            <div className="progress-display">
              <div className="bars">
                {monthsTab.map((month, index) => {
                  const percent = (month.count / monthTarget) * 200;
                  const large = 60 / 12;
                  return (
                    <div key={index}>
                      <div
                        style={{
                          position: percent > 400 ? "absolute" : "relative",
                          bottom: percent > 400 ? "380px" : "0px",
                          textAlign: "center",
                          color: !month.count ? "#1F2231" : "white",
                        }}
                      >
                        {month.count}
                      </div>
                      <div
                        className="progress-bar-days"
                        style={{
                          height: `${percent}px`,
                          width: `${large}vw`,
                          backgroundColor:
                            month.count > monthTarget
                              ? "#c2830e"
                              : "rgb(61, 61, 61)",
                        }}
                      ></div>
                      <div style={{ height: "20px", textAlign: "center" }}>
                        {month.month}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="target">{monthTarget}</div>
            </div>
          )}
        </>
      )}
    </>
  );
}
