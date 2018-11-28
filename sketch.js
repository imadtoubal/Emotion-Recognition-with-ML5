let mobilenet;
let video;
let classifier;
let predictions = [];
let probabilities = [];
let classButtons = [];
let trainButton;
let trainingProgress;
let canvas;

let ctracker;


let classes = ['Happy', 'Sad', 'Surprised'];

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('mainCanvas');
  background(20);
  video = createCapture(VIDEO);
  video.hide();
  mobilenet = ml5.featureExtractor('MobileNet', () => {
    console.log('Model is ready!');
  });

  classifier = mobilenet.classification(video, () => {
    console.log('Video is ready!');
  });

  trainingProgress = select('#training-progress');

  for (let i = 0; i < 3; i++) {
    predictions.push(select('#class'+ (i -(-1)) +'-name'));
    probabilities.push(select('#class'+ (i -(-1)) +'-probability'));
    classButtons.push(select('#class'+(i - (-1))+'button'));
    classButtons[i].mousePressed(function() {
      classifier.addImage(classes[i]);
    });
  }
  trainButton = select('#train-button');
  trainButton.mousePressed(function() {
    let progress = 0;
    classifier.train((loss) => {
      if(loss === null) {
        trainingProgress.attribute('style', 'width:100%');
        trainingProgress.html('Finished');
        console.log('Training finished!');
        classifier.classify(gotResults);
      } else {
        progress = lerp(progress, 100, .2);
        trainingProgress.attribute('style', 'width:'+progress+'%');
        // trainingProgress.attribute('style', 'width:'+progress+'%');
        console.log(loss);
      }
    });
  });

  // setup tracker
  // ctracker = new clm.tracker();
  // ctracker.init(pModel);
  // ctracker.start(videoInput.elt);

}

function draw() {
  image(video, 0, 0, width, height);
  // get array of face marker positions [x, y] format
  // var positions = ctracker.getCurrentPosition();
        
  // for (var i=0; i<positions.length; i++) {
  //   // set the color of the ellipse based on position on screen
  //   fill(map(positions[i][0], width*0.33, width*0.66, 0, 255), map(positions[i][1], height*0.33, height*0.66, 0, 255), 255);
  //   // draw ellipse at each position point
  //   ellipse(positions[i][0], positions[i][1], 8, 8);
  // }
}

function gotResults(error, result) {
  if(error) {
    console.log(error);
  } else {
    console.log(result);
    for (let i = 0; i < 3; i++) {
      predictions[i].html(classes[i]);
      probabilities[i].html((result == classes[i]? 100 : 0) + '%');
      probabilities[i].attribute('aria-valuenow', (result == classes[i]? 100 : 0));
      // probabilities[i].attribute('style', 'width:' + floor(results[i].probability * 100)+ '%');
      probabilities[i].attribute('style', 'width:' + (result == classes[i]? 100 : 0)+ '%');
    }  
    classifier.classify(gotResults);
  }

}