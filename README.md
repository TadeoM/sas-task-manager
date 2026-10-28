# Getting Started

```
yarn install
yarn start
yarn e2e // runs playwright tests
yarn test // runs unit tests
```

Runs at `http://localhost:5173`.

Other commands:
- `yarn build`: type-checks and builds for production
- `yarn test`: unit tests (Vitest)
- `yarn e2e`: end-to-end tests (Playwright); boots the dev server itself if one isn't already running
- `yarn lint` / `yarn format`: Biome

# Tech Stack

- React
- Typescript
- Vite
- MUI
- Biome
- Playwright
- Yarn

To begin, I wanted the tech stack to be the minimum requirement. The request was for not feature rich, but responsive and clean, that's our goal. React, Typescript and Vite I am quite familiar with, so using those in this project made the most sense.

Playwright is one framework I'm not too familiar with, but learned for this project. This was an interesting challenge that I had to work through.

# Controls

The custom behavior I added for keyboards that was necessary was moving the tasks back and forth with keyboard shortcuts.
**CTRL + Arrow Keys** move the tasks between each of the tasks. This detail of accessibility isn't something I've had explicit training on, however, a place that I wondered, and would maybe add to, would be having the focus follow the element that we just moved. Other than that, **Tab** and **Enter** are able to interact with most of the app.

You can also Drag and Drop with mouse controls and clicking on tasks to change details, this is my preferred way to move around the app.

I also went back in and tested on my phone to make sure that the app was usable, and I’m glad to say that it was, after some small tweaks. 

# UI/UX Design

The task manager that I like the most is Trello, I find it simple and easy to use, and so I aimed to emulate its UI/UX.
This early decision made it easy for me to start working on the project. 

For the modal of the Task item details, I had started with live-updates. As I was using it, I realized that a user doesn't always make edits they want to keep, mostly accidentally, and adding a save/cancel button was a quality of life feature that made any changes to a task reversible until they decide they're done.

I also had the titles of tasks originally editable while outside modals, in the base-app. I decided to move away from that, as I had to then answer the question "If I'm just using keyboard, what controls do I need to edit the title, and how does that differ from wanting to open the details mofal". This was also a problem for mouse, though there would be easier work arounds. I could have added a pencil button to enable editing for instance. Regardless, I went with making the title a button that allows you to open the details modal. Later I'd find that Trello does similarly, and so it made me more confident in that decision. I think it's more personal choice, but I can see an argument for pencil mark, I just think that it's not much more work to open the modal to edit a task, and leave the main page for just moving/deleting tasks.

# Accessibility

For the first real features for this, I wanted to make sure that the application was functional via keyboard and mouse, standalone. This meant including keyboard shortcuts for all the functionality, and also having them be doable via just a mouse. At first I thought I'd want to develop my own drag and drop functionality, however, I did some searching online and found an out of the box solution that was much faster to implement, and I being widely used, had fewer chances of causing mistakes: @dnd-kit, or Drag and Drop Kit. This library had exactly what I wanted, and I felt that a library explicitly made to do this, is better than trying to make custom-functionality for bragging rights.

Another aspect of accessibility I addressed later in the project, was colorblindness. Once I was mostly happy with the functionality, I put it through the inspector's colorblind filters. I had first been using a red color to indicate overdue tasks, this looked fine to me, but when under the Protanopia and Deuteranopia filters, it was a little difficult to read. The chosen orange was deliberate, as it still has contrast with the app, where it was eye-catching. 

The icon switch was also deliberate, though in retrospect, I'm not sure how many people are actually Achromatopsia colorblind, I thought it was a nice addition, where the icon was at least different for this demographic.

Another thing I was trying to do intentionally, was using MUI components, and assuring that they weren't just Divs under the hood, which it seems MUI is quite good about, so I was content. 
Two properties that I'd point out are the Chip's Label prop for Overdue, and the titleAccess prop in the description Icon for task items. I could have just gone with an icon about being overdue, but adding text to differentiate from non-overdue tasks is useful for people using screen readers, and for the titleAccess attribute, this is a field that was readable by screen readers, whether it's that important is up to interpretation.

# Testing

I was most concerned with end to end testing here, but to briefly talk about the Unit Tests. The main functionality that I could unit test was the dates functionality. I needed to add some formatting to the due dates to shorten the text, which was why I landed on Shortened month and date. For this task manager, I didn't envision years as a useful increment, I mostly cared about the month and date, that's a normal task timeframe. So some light unit testing for this was obvious, just making sure that those formatting functions work. Separating them into helpers also would allow future places for them to be used, and made the location of the unit test obvious.

The end to end testing was the part that I tried to have better coverage on/was more concerned about. Probably the one I think was most useful is the drag and drop/keyboard task management functionality. It covers a couple things, this feature is integral to the app's purpose, and it tests accessibility for two main types of users. 

I also thought about adding integration tests with React Testing Library, but decided against it. The trickiest parts of the app are the drag and drop and the grid layout, and from what I read, jsdom doesn't really handle pointer events or page positions, so those tests wouldn't tell me much about whether it actually works. The date helpers were the main logic I could pull out on its own, and those have unit tests, and the rest is covered by the Playwright tests in a real browser. I felt like a middle layer would mostly be testing the same things twice.

An option I had for data reliability was using ZOD to validate data structures. In a larger project I would 100% use it, but for this small app, I didn't think it was necessary. I added a short validation script in the fake repository and called it a day.
