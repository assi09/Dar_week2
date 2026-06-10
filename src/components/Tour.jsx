import { useEffect, useState } from 'react';
import { Joyride } from 'react-joyride';

const STORAGE_KEY = 'dar-chat-tour-completed';

const STEPS = [
  {
    target: '[data-tour="header"]',
    content: "Welcome to Dar Chat — your CIS Controls v8 assistant. Let's take a quick tour.",
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '[data-tour="new-chat"]',
    content: 'Start a new conversation at any time with this button.',
    placement: 'right',
  },
  {
    target: '[data-tour="sidebar-list"]',
    content: 'Past conversations are saved here — click one to pick up where you left off.',
    placement: 'right',
  },
  {
    target: '[data-tour="chat-viewport"]',
    content: 'Answers stream in live and are formatted as markdown, with sources you can expand.',
    placement: 'top',
  },
  {
    target: '[data-tour="input-bar"]',
    content: 'Ask anything about the CIS Controls v8 here, then rate each answer with 👍 / 👎.',
    placement: 'top',
  },
];

export default function Tour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setRun(true);
    }
    const handleStartTour = () => setRun(true);
    window.addEventListener('start-tour', handleStartTour);
    return () => window.removeEventListener('start-tour', handleStartTour);
  }, []);

  const handleCallback = (data) => {
    if (['finished', 'skipped'].includes(data.status)) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={STEPS}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleCallback}
      styles={{ options: { primaryColor: '#4f46e5', zIndex: 1000 } }}
    />
  );
}
