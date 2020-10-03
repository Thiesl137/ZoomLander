// create calender
const calEvents = require('./calendar-curr'); //get .json file 

// Calendar: {date String rep "2020-10-15" : Class instance}
// const eventsByDay = {};

// calEvents.forEach(obj => {
  
//   const dateStr = obj.start.dateTime.slice(0,10);
  
//   // console.log(dateStr);
//   let event = {
//     location: obj.location, 
//     startTime: obj.start.dateTime, 
//     endTime: obj.end.dateTime
//   };

//   if (eventsByDay[dateStr]) {
//     eventsByDay[dateStr].push(event);
//   } else {
//     eventsByDay[dateStr] = [event]
//   }
   
// });

function pullEvents(calEventsArr){
  return calEventsArr.reduce((calEvents, event) => {
    const dateStr = event.start.dateTime.slice(0,10);

    let relevantData = {
      location: event.location, 
      startTime: event.start.dateTime, 
      endTime: event.end.dateTime
    }

    if (calEvents[dateStr]) {
      calEvents[dateStr].push(relevantData);
    } else {
      calEvents[dateStr] = [relevantData]
    }
    
    return calEvents; 

  }, {})
}

function getCurrentDayKey() {
  // get current time (now) -> Date obj (method) getTime 
  return JSON.stringify(new Date()).slice(1,11);
};


function getDayEvents(dateStr) {
  return eventsByDay[dateStr];
}

function getZoomLink(events, timeNow) { 
  const zoomCheck = "https://zoom.us" 
  // const timeNow = (new Date()).getTime;
  for(let i = 0; i < events.length; i++){
    let event = events[i];
    let zoomMeeting = event.location.includes(zoomCheck);
    let startTime = (new Date(event.startTime)).getTime();
    let endTime = (new Date(event.endTime)).getTime();
    let tenMinutesInMill = 600000;  //Early entry into zoom link.

    // console.log(event);
    // console.log("startTime: ", startTime);
    // console.log("timeNow:   ", timeNow);
    // console.log("endTime:   ", endTime);

    if (timeNow >= (startTime - tenMinutesInMill) && timeNow <= endTime && zoomMeeting){
      return event.location;
    } 
  }

  return 'No Zoom Link'
}

console.log(pullEvents(calEvents));

// console.log(getDayEvents("2020-10-29"));
// console.log(getZoomLink(getDayEvents("2020-10-29"), (new Date('2020-10-29T16:51:00-07:00')).getTime()))