const url = chrome.runtime.getURL('./calendar-curr.json');

let calEvents;

fetch(url)
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      response.json().then(function(data) {
        calEvents = data;
        // alert(`calEvents in fetch is: ${calEvents}`)
      });
    }
  )
  .catch(function(err) {
    alert('Fetch Error :-S', err);
  });


chrome.browserAction.onClicked.addListener(function() { 

  //Button click functionality goes here

  // alert(`calEvents in onClicked is: ${calEvents}`);

  const events = pullEvents(calEvents);
  // alert(`events is ${events}`);
  
  const currentDay = getCurrentDayKey();
  // alert(`current day is: ${currentDay}`);

  // const timeNow = (new Date('2020-10-29T16:51:00-07:00')).getTime();
  const timeNow = (new Date()).getTime();
  // alert(`timeNow is: ${timeNow}`);

  const currentDayEvents = getDayEvents(events, currentDay);
  // alert(`currentDayEvents is: ${currentDayEvents}`);

  const event = getEvent(currentDayEvents, timeNow);
  // alert(`zoomLink is ${zoomLink}`);
  alert(`Landing on - \n${event.name}\nLOCATION CONFIRMED: ${event.location}`)

  chrome.tabs.create({url : event.location, active: true});
  
});

function pullEvents(calEventsArr){
  return calEventsArr.reduce((calEvents, event) => {
    const dateStr = event.start.dateTime.slice(0,10);

    let relevantData = {
      name: event.summary,
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
  return JSON.stringify(new Date()).slice(1,11);
  // return "2020-10-29"
};

function getDayEvents(events,dateStr) {
  return events[dateStr];
}

function getEvent(events, timeNow) { 
  const zoomCheck = "https://zoom.us" 

  for(let i = 0; i < events.length; i++){
    let event = events[i];
    let zoomMeeting = event.location.includes(zoomCheck);

    //'2020-10-03T11:00:00-07:00'
    // let startTime = (new Date('2020-10-03T10:30:00-07:00')).getTime();
    let startTime = (new Date(event.startTime)).getTime();


    // let endTime = (new Date('2020-10-03T11:30:00-07:00')).getTime();
    let endTime = (new Date(event.endTime)).getTime();


    let tenMinutesInMill = 600000;  //Early entry into zoom link.

    // alert(`event in getZoomLink is: ${event}`);
    // alert(`startTime in getZoomLink is: ${startTime}`);
    // alert(`timeNow in getZoomLink is: ${timeNow}`);
    // alert(`endTime in getZoomLink is: ${endTime}`);
    
    if (timeNow >= (startTime - tenMinutesInMill) && timeNow <= endTime && zoomMeeting){
      
      return {name: event.name, location: event.location};
    } 
  }

  return 'No Zoom Link'
}

// console.log(pullEvents(calEvents));
// console.log(getDayEvents("2020-10-29"));
// console.log(getZoomLink(getDayEvents("2020-10-29"), (new Date('2020-10-29T16:51:00-07:00')).getTime()))