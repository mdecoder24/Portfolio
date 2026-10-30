import { CaseStudy } from '../schema.ts';

export const signLanguageRecognition = CaseStudy.parse({
  slug: 'sign-language-recognition',
  kind: 'personal',
  title: 'Sign language recognition',
  context: 'Computer vision',
  outcome: 'Reads sign language in real time, served from Firebase for low-latency inference.',
  role: 'Developer',
  stack: ['React', 'TensorFlow', 'MediaPipe', 'Firebase'],
  categories: ['ai-ml'],
  links: [
    { label: 'GitHub', href: 'https://github.com/mdecoder24/Sign-Language-Recognition' },
    { label: 'Live', href: 'https://sign-language-recognitio-a7e2a.web.app/' },
  ],
  featured: true,
  media: {
    src: '/media/sign-language-recognition/screen.jpg',
    screen: '/media/sign-language-recognition/phone.jpg',
    alt: 'The SLR home page: a gradient headline about learning sign language beside a glowing blue scan of a raised hand',
  },
  // From the repository's README and package.json
  readme: {
    overview:
      'A real-time sign language recognition app. It reads hand signs through the webcam and recognises the 26 letters and 16 common words of American Sign Language.',
    features: [
      'Recognition in real time from the webcam',
      'A custom dataset, with the training code in the repository',
      'Progress charts for each signed-in user',
      'Hosting, sign-in and storage on Firebase',
    ],
    tech: ['React', 'Redux', 'MediaPipe', 'Chart.js', 'Firebase'],
    run: ['npm install', 'npm start'],
  },
  body: {
    problem:
      'Most people never learn sign language, so a lot of everyday conversations still need an interpreter.',
    built:
      'A real-time computer vision system that recognises sign language. A TensorFlow deep learning model does the recognition, trained through ML pipelines I built, with MediaPipe and a React front end, deployed on Firebase.',
    decisions: [
      {
        title: 'My own training pipeline',
        detail: 'The ML training pipelines behind the model are my own.',
      },
      {
        title: 'A deep learning model',
        detail: 'Recognition runs on a TensorFlow deep learning model with MediaPipe, inside a React app.',
      },
      {
        title: 'Served from Firebase',
        detail: 'Hosted on Firebase to keep inference fast.',
      },
    ],
    results: ['Detects signs in real time', 'Low-latency inference on Firebase'],
  },
});
