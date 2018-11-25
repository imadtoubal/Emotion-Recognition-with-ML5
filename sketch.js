let mobilenet;
let video;
let predictions = [];
let probabilities = [];
let canvas;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('mainCanvas');
  background(20);
  video = createCapture(VIDEO);
  video.hide();
  mobilenet = ml5.imageClassifier('MobileNet', video, () => {
    console.log('Model is ready!');
    mobilenet.predict(gotResults);
  });
  for (let i = 0; i < 3; i++) {
    predictions.push(select('#class'+ (i -(-1)) +'-name'));
    probabilities.push(select('#class'+ (i -(-1)) +'-probability'));
  }
}

function draw() {
  image(video, 0, 0, width, height)
}

function gotResults(error, results) {
  if(error) {
    console.log(error);
  } else {
    // console.log(results);
    for (let i = 0; i < 3; i++) {
      predictions[i].html(results[i].className);
      probabilities[i].html(floor(results[i].probability * 100) + '%');
      probabilities[i].attribute('aria-valuenow', floor(results[i].probability * 100));
      probabilities[i].attribute('style', 'width:' + floor(results[i].probability * 100)+ '%');
    }  
    mobilenet.predict(gotResults);
  }

}