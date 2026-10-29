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
  featured: true,
  media: {
    src: '/media/sign-language-recognition/cover.svg',
    alt: 'A webcam view with landmarks traced over a raised hand, and the detected sign beside it',
  },
  body: {
    problem:
      'Most people never learn sign language, so a lot of everyday conversations still need an interpreter.',
    built:
      'A real-time sign-language detector. I wrote the preprocessing and training pipelines for the model, built the front end in React, and deployed it on Firebase.',
    decisions: [
      {
        title: 'My own training pipeline',
        detail: 'The data preprocessing and model training are pipelines I built.',
        at: { x: 77, y: 34 },
      },
      {
        title: 'MediaPipe and TensorFlow',
        detail: 'MediaPipe and TensorFlow handle the detection, inside a React app.',
        at: { x: 36, y: 40 },
      },
      {
        title: 'Served from Firebase',
        detail: 'Hosted on Firebase to keep inference fast.',
        at: { x: 12, y: 15 },
      },
    ],
    results: ['Detects signs in real time', 'Low-latency inference on Firebase'],
  },
});
