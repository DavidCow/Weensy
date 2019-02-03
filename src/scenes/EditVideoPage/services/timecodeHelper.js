//e.g. Input sec: float 2.1425, output : int 2142
export function convertSecToMS(sec) {
    return sec*1000;
}

export function convertMsToSec(ms) {
    if (ms == 0) {
        return 0;
    }
    return (ms/1000);
}

//e.g. Input t1: String "00:00:01.234", Input 2 is 3240 ms, Output is String: "00:00:04.474"
export function calculateEndOfClip(timeCode, marginInMsInt) {
  var timeCodeInMs = convertTimeCodeToMillisecs(timeCode);
  var endResultInMsInt = timeCodeInMs + marginInMsInt;
  return convertMsIntIntoTimeCodeStr(endResultInMsInt);
}

//e.g. Input 2324 int (in ms), Output : String "00:00:02.324"
export function convertMsIntIntoTimeCodeStr(inputInMs) {
    endResultAsStr = "00:";
  //hour is skipped
  
    minutes = inputInMs/60000;
  if (minutes < 10) {
      endResultAsStr += "0";
  }
  endResultAsStr += parseInt(minutes, 10) + ":";
  
  inputInMs = inputInMs%60000;
  
  seconds = inputInMs/1000;
  if (seconds < 10) {
      endResultAsStr += "0";
  }
  endResultAsStr += parseInt(seconds, 10) + ".";
  
  inputInMs = inputInMs%1000;
  if (inputInMs < 10) {
      endResultAsStr += "00";
  } else if (inputInMs < 100) {
      endResultAsStr += "0";
  }
  endResultAsStr += ""+inputInMs;
  
  return endResultAsStr;
}

 //e.g. Input t1 : String "00:00:04.120" Input t2: String "00:00:06.120" output: 2000 (ms)
 export function calculateTimeBetweenTwoTimecodesInInt(timeCode1, timeCode2) {
  var t1 = convertTimeCodeToMillisecs(timeCode1);
  var t2 = convertTimeCodeToMillisecs(timeCode2);

  if (t2 > t1) {
     return t2-t1;
  }
  return t1-t2;
}

//e.g. String "00:00:04.120" as Input, Output is: Integer 4120
export function convertTimeCodeToMillisecs(timeCode) {
  var endResultInMs = 0;
       //seconds and ms calculation
  var splitToSecAndMs = timeCode.split(":")[2].replace(".","");
  endResultInMs += parseInt(splitToSecAndMs);
  
  //minute calculation, 1 min = 60000 ms
  var splitToMin = parseInt(timeCode.split(":")[1])*60000;
  endResultInMs += splitToMin;
  
  //hour calculation is skipped, probably never used
  return endResultInMs;
}