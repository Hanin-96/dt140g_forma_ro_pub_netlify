import LoadingSpinnerStyle from '../LoadingSpinner/LoadingSpinnerStyle.module.css';
import dayjs from "dayjs";
import locale from "dayjs/locale/sv";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import weekdayPlugin from "dayjs/plugin/weekday";
import "./CalendarStyle.css";
import isTodayPlugin from "dayjs/plugin/isToday";
import isBetweenPlugin from "dayjs/plugin/isBetween";
dayjs.extend(weekdayPlugin);
dayjs.extend(isTodayPlugin);
dayjs.extend(isBetweenPlugin);
dayjs.locale("sv");

function Calendar() {
  const [fetchError, setFetchError] = useState("");
  const [eventData, setEventData] = useState<any>();
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [arrayOfDays, setArrayOfDays] = useState<any[]>([]);
  const [loadingSpinner, setLoadingSpinner] = useState(false);


  //Hämta events från Wordpress API

  const getAllEvents = async () => {
    setLoadingSpinner(true);
    try {
      const response = await fetch("http://localhost:8002/wp-json/wp/v2/event?_fields=title,event_start_date,event_end_date,event_description,event_location", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        if (data.length > 0) {
          setEventData(data);
          setLoadingSpinner(false);
        }
      }
    } catch (error) {
      setFetchError("finns inga event att hämta");
      setLoadingSpinner(false);
    }
  };

  //Tar emot dag och kollar om den har ett event
  const hasEventForDate = (date: dayjs.Dayjs) => {
    //Kollar om det finns event mellan start och slutdatum
    return eventData?.some((event: any) => {
      const start = dayjs(event.event_start_date);
      const end = event.event_end_date ? dayjs(event.event_end_date) : start;
      return date.isBetween(start, end, "day", "[]");
    });
  };


  dayjs.locale(locale);
  const now = dayjs().locale({
    ...locale,
  });
  const dateFormat = "MMM YYYY";

  //Nästa månad
  const nextMonth = () => {
    const plusMonth = currentMonth.add(1, "month");
    setCurrentMonth(plusMonth);
  }

  //Föregående månad
  const prevMonth = () => {
    const minusMonth = currentMonth.subtract(1, "month");
    setCurrentMonth(minusMonth);
  };

  //Loopar igenom dagar
  const renderWeekDays = () => {
    const dateFormat = "dddd";
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="flex" key={i}>
          {now.weekday(i).format(dateFormat)}
        </div>
      );
    }
    //Returnerar lista av dagar
    return <div className="flex justify-evenly text-[16px]">{days}</div>
  };

  const formateDateObject = (date: dayjs.Dayjs) => {
    return {
      day: date.date(),
      month: date.month(),
      year: date.year(),
      isCurrentMonth: date.month() === currentMonth.month(),
      isCurrentDay: date.isToday()
    };
  };

  //Hämta alla dagar 
  const getAllDays = () => {
    const startOfMonth = currentMonth.startOf("month");
    const startDate = startOfMonth.startOf("week");

    //7dagar x 6veckor för 6 rader
    const totalDays = 42;
    const days = [];

    //Loopar igenom totala dagar som ska visas
    for (let i = 0; i < totalDays; i++) {
      const day = startDate.add(i, "day");
      days.push(formateDateObject(day));
    }

    //Dela upp i veckor 
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push({ dates: days.slice(i, i + 7) });
    }
    //Lägger in värden i state
    setArrayOfDays(weeks);
  };

  //Renderar ut alla celler
  const renderCells = () => {
    const rows: any = [];

    //Loopar igenom varje vecka 
    arrayOfDays.forEach((week, index) => {
      const days: any = [];

      //Loopar igenom varje dag i en vecka
      week.dates.forEach((d: any, i: any) => {
        //Skapar upp day objekt
        const dateObj = dayjs(`${d.year}-${d.month + 1}-${d.day}`);

        //Kollar om dagen är vald
        const isSelected = selectedDate?.isSame(dateObj, "day");
        //Kollar om dagen har ett event
        const hasEvent = hasEventForDate(dateObj);
        //Skapar upp hur dagen ska se ut
        days.push(
          <div
            key={i}
            className={`flex justify-center mb-4 cursor-pointer relative ${!d.isCurrentMonth
              ? "text-forma_ro_light_grey"
              : d.isCurrentDay
                ? "selected"
                : "text-forma_ro_black"
              }`}
            onClick={() => {
              if (hasEvent) {
                setSelectedDate(dateObj);
              } else {
                setSelectedDate(null);
              }

            }
            }
          >
            <span
              className={`w-14 h-14 flex items-center justify-center rounded-full font-semibold
            ${isSelected ? "bg-forma_ro_green shadow-md" : "bg-white"}${hasEvent ? " has-event" : ""}
            `}
            >
              {d.day}
            </span>

          </div>
        );
      });

      //Skapar upp hela veckan som rad
      rows.push(
        <span className="flex justify-evenly text-[16px]" key={index}>
          {days}
        </span>
      );
    });

    //Returner alla veckor som en grupp
    return <div>{rows}</div>;
  };

  //Hämtar event på vald dag
  const getEventsForSelectedDate = () => {
    //Om inget är valt, returnera tom lista
    if (!selectedDate) return [];

    //Filtrera fram valda dagar
    return eventData?.filter((event: any) => {
      const start = dayjs(event.event_start_date);
      const end = event.event_end_date ? dayjs(event.event_end_date) : start;
      return selectedDate.isBetween(start, end, "day", "[]");
    }) || [];
  };


  useEffect(() => {
    getAllDays();
    getAllEvents();
  }, [currentMonth]);


  return (
    <>
      {loadingSpinner && <div className={LoadingSpinnerStyle.loadingSpinner}></div>}
      {!loadingSpinner &&
        <div className="max-w-[100rem] w-full mx-auto flex mt-20 gap-10 justify-between">
          <div className=" max-w-[60rem] w-full border-forma_ro_grey border-[1px] rounded-2xl p-4 max-h-[50rem] h-full">
            <div className=" flex items-center max-w-[60rem] w-full justify-between mb-8">
              <button onClick={() => prevMonth()} aria-label='Föregående månad' type='button'>
                <ChevronLeft />
              </button>
              <p>{currentMonth.format(dateFormat)}</p>
              <button onClick={() => nextMonth()} aria-label='Nästa månad' type='button'>
                <ChevronRight />
              </button>
            </div>

            <div>
              <div className="mb-4">
                {renderWeekDays()}
              </div>
              {renderCells()}
            </div>
          </div>
          <div className="max-w-[35rem] w-full bg-white rounded-2xl max-h-full shadow-md">
            {selectedDate ? (
              <>
                <div className="bg-forma_ro_green w-full rounded-t-2xl">
                  <h3 className=" text-center">
                    {selectedDate.format("D MMMM YYYY")}
                  </h3>
                </div>
                <div className="p-4">
                  {getEventsForSelectedDate().map((event: any, index: number) => (
                    <div key={index} className="flex flex-col justify-between gap-4">
                      <h4 className="font-bold text-[20px]">{event.title?.rendered}</h4>
                      <p><span className="font-bold">När: </span>
                        {dayjs(event.event_start_date).format("D MMM HH:mm")} {event.event_end_date
                          ? ` – ${dayjs(event.event_end_date).format("D MMM HH:mm")}`
                          : ""}
                      </p>
                      <p><span className="font-bold">Plats:</span> {event.event_location}</p>
                      <p className="mb-10">{event.event_description}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-4">
                <p className="text-[16px] m-2 flex items-center gap-4">Välj ett datum markerat med ett event <span
                  className={`w-14 h-14 flex items-center justify-center rounded-full has-event`}>
                </span></p>

              </div>
            )}
          </div>
          {fetchError && <p>{fetchError}</p>}

        </div>
      }

    </>
  )
}

export default Calendar