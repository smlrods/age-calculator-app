import { useEffect, useState } from 'react';
import './App.sass'

function App() {
  const [days, setDays] = useState<number>();
  const [months, setMonths] = useState<number>();
  const [years, setYears] = useState<number>();

  return (
    <div className="App">
      <Input setDays={setDays} setMonths={setMonths} setYears={setYears} />
      <Result days={days} months={months} years={years} />
    </div>
  )
}

function Result({days, months, years}: {days: number | undefined, months: number | undefined, years: number | undefined}) {
  return (
    <div className='result'>
      {years ? years : '--'} years
      {months ? months : '--'} months
      {days ? days : '--'} days
    </div>
  );
}

function Input({setDays, setMonths, setYears}: {setDays: React.Dispatch<React.SetStateAction<number | undefined>>, setMonths: React.Dispatch<React.SetStateAction<number | undefined>>, setYears: React.Dispatch<React.SetStateAction<number | undefined>>}) {

  const [inputDay, setInputDay] = useState<number>();
  const [inputMonth, setInputMonth] = useState<number>();
  const [inputYear, setInputYear] = useState<number>();
  const [formErrors, setFormErrors] = useState({
    day: "",
    month: "",
    year: "",
    date: ""
  });

  function isValidDate(day: number | undefined, month: number | undefined, year: number | undefined) {
    // Create a new Date object with the components
    const date = new Date(`${year}-${month}-${day}`);

    // Check if the Date object is valid and its components match the input
    return date.getFullYear() == year && date.getMonth() + 1 == month && date.getDate() == day;
  }

  function calculateAge(inputDays: number, inputMonths: number, inputYears: number) {
    const now = new Date();

    const years = now.getFullYear() - inputYears;
    const months = now.getMonth() - inputMonths;
    const days = now.getDate() - inputDays;

    if (months < 0 || (months === 0 && days < 0)) {
      setYears(years - 1);
      setMonths(12 + months);
      setDays(30 + days);
    } else {
      setYears(years);
      setMonths(months);
      setDays(days);
    }
  }

  function validateForm(inputDay: number, inputMonth: number, inputYear: number): boolean {
    const newErrors = {day: '', month: '', year: '', date: ''};
    const date = new Date(`${inputYear}-${inputMonth}-${inputDay}`);
    if ((inputDay && inputMonth && inputYear) &&
        !(date.getFullYear() == inputYear &&
         date.getMonth() + 1 == inputMonth &&
         date.getDate() == inputDay)
    ) {
      newErrors.date = 'Must be a valid date';
    }

      if (!inputDay && inputDay != 0) {
      newErrors.day = 'This field is required';
    } else if (!(inputDay > 0 && inputDay <= 31)) {
      newErrors.day = 'Must be a valid day';
    }

    if (!inputMonth && inputMonth != 0) {
      newErrors.month = 'This field is required';
    } else if (!(inputMonth > 0 && inputMonth <= 12)) {
      newErrors.month = 'Must be a valid month';
    }

    if (!inputYear && inputYear != 0) {
      newErrors.year = 'This field is required';
    } else if (inputYear > new Date().getFullYear()) {
      newErrors.year = 'Must be in the past';
    }

    setFormErrors(newErrors);
    const valid = Object.values(newErrors).every((error) => error === '');
    return valid;
  }

  return (
    <div className='input'>
      <div>
        <div>
          <label htmlFor="day">Day</label>
          <input type='number' placeholder='DD' id='day' min={1} max={31} onChange={(e) => {
          if (e.target.value === '') {
            setInputDay(undefined);
          } else {
            setInputDay(+e.target.value)}
          }
          } />
          {formErrors.day && <div>{formErrors.day}</div>}
          {formErrors.date && <div>{formErrors.date}</div>}
        </div>
        <div>
          <label htmlFor="month">Month</label>
          <input type='number' placeholder='MM' id='month' min={1} max={12} onChange={(e) => {
          if (e.target.value === '') {
            setInputMonth(undefined);
          } else {
            setInputMonth(+e.target.value);
          }
          }} />
          {formErrors.month && <div>{formErrors.month}</div>}
        </div>
        <div>
          <label htmlFor="year">Year</label>
          <input type='number' placeholder='YYYY' id='year' min={1} max={new Date().getFullYear()} onChange={(e) => {
          if (e.target.value === '') {
            setInputYear(undefined);
          } else {
            setInputYear(+e.target.value);
          }
          }} />
          {formErrors.year && <div>{formErrors.year}</div>}
        </div>
      </div>
      <div>
        <button onClick={() => {
          if(inputDay && inputMonth && inputYear && validateForm(inputDay, inputMonth, inputYear)) {
            calculateAge(inputDay, inputMonth, inputYear) 
            return;
          }

          setDays(undefined);
          setMonths(undefined);
          setYears(undefined);
        }}>Submit</button>
      </div>
    </div>
  );
}

export default App
