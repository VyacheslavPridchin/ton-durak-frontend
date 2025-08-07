<p align="center"><h1 align="center">DURAK-FRONTEND</h1></p>

# Overview

**Durak** is a modern mobile web-based card game built as a Single Page Application (SPA) using **Vue 3 Composition API** and **TypeScript**. This project reimagines the classic Russian card game with a strong focus on social interaction, customization, and scalable multiplayer gameplay.

The application is fully integrated with **Telegram Mini Apps**, enabling seamless user authentication through Telegram accounts and fostering an engaged player community.

## Key Features

- **Player Accounts** — Users are automatically authenticated via Telegram, linking their game progress and achievements to their Telegram identity.
- **Full Game Logic** — A complete implementation of the classic "Durak" card game, including support for both throwing and passing rule variants.
- **Tournaments & Leagues** — Regular tournaments and a league system allow players to compete for rewards, climb leaderboards, and earn exclusive in-game prizes.
- **Card Skins System** — A flexible customization system that lets players change the visual style of their deck based on preferences and earned achievements.
- **In-Game Emotes** — Players can express themselves using emotes and reactions during matches, adding personality and competitive energy to every game.
- **Localization Support** — Multi-language support ensures a smooth experience for players from different regions around the world.
- **Mobile-First Design** — The interface and interaction logic are fully optimized for touch controls and small screens, delivering a responsive and intuitive experience.

**Durak** is more than just a game — it’s a social platform for card game enthusiasts, combining timeless gameplay with competitive multiplayer, customization, and community-driven features.


|      | Feature         | Summary       |
| :--- | :---:           | :---          |
| ⚙️  | **Architecture**  | <ul><li>Utilizes Vue.js for frontend development, ensuring a reactive and component-based architecture.</li><li>Typescript is used for static typing, enhancing code quality and maintainability.</li><li>Structured with multiple configuration files (`tsconfig.json`, `tsconfig.node.json`) to handle different environments effectively.</li></ul> |
| 🔩 | **Code Quality**  | <ul><li>Typescript enhances code reliability and predictability.</li><li>Use of modern tools like Vite for fast development and builds.</li><li>Code modularization is evident with separate configurations for different aspects of the project.</li></ul> |
| 📄 | **Documentation** | <ul><li>Documentation includes details on installation and usage commands, although specific commands need to be inserted.</li><li>Language usage is well-documented with primary focus on Vue.js and TypeScript.</li><li>Documentation structure supports npm as the package manager, indicating streamlined dependency management.</li></ul> |
| 🔌 | **Integrations**  | <ul><li>Integrates with various libraries like Vue Router for routing and Axios for HTTP requests.</li><li>Animation features are supported by GSAP.</li><li>Swiper library integrated for touch sliders.</li></ul> |
| 🧩 | **Modularity**    | <ul><li>High modularity with separate tsconfig files for different environments.</li><li>Vue components likely modularized given the high count of `.vue` files.</li><li>Use of npm scripts for task running, enhancing modularity in operations.</li></ul> |
| ⚡️  | **Performance**   | <ul><li>Use of Vite for optimized builds and fast reloading.</li><li>Vue.js and GSAP for efficient and smooth UI interactions.</li><li>Performance optimizations likely through effective use of modern JavaScript and CSS techniques.</li></ul> |
| 📦 | **Dependencies**  | <ul><li>Managed by npm, ensuring easy updates and consistent dependency versions across environments.</li><li>Includes critical libraries like Vue, Axios, and GSAP for core functionality.</li><li>Dependency on modern tooling like Vite and TypeScript for development efficiency.</li></ul> |

---

##  Project Structure

```sh
└── durak-frontend/
    ├── README.md
    ├── env.d.ts
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── public
    │   ├── assets
    │   │   ├── cards
    │   │   │   └── skins
    │   │   │       ├── black_test
    │   │   │       └── ton_default
    │   │   ├── emotions
    │   │   │   ├── crying.json
    │   │   │   ├── exploding.json
    │   │   │   ├── hah_out.json
    │   │   │   ├── loving.json
    │   │   │   ├── thinking.json
    │   │   │   └── waving.json
    │   │   ├── icons
    │   │   │   ├── balance-icon.svg
    │   │   │   ├── close-emote-icon.svg
    │   │   │   ├── default-profile-picture.svg
    │   │   │   ├── durak-icon.svg
    │   │   │   ├── durak-player-icon.svg
    │   │   │   ├── emote-icon.svg
    │   │   │   ├── empty-player.svg
    │   │   │   ├── exit-icon.svg
    │   │   │   ├── flag-icon.svg
    │   │   │   ├── mute-picture.svg
    │   │   │   ├── reconnect-animated-icon.svg
    │   │   │   ├── reconnect-icon.svg
    │   │   │   ├── suits
    │   │   │   │   ├── Clubs.svg
    │   │   │   │   ├── Diamonds.svg
    │   │   │   │   ├── Hearts.svg
    │   │   │   │   └── Spades.svg
    │   │   │   ├── timer-icon.svg
    │   │   │   ├── transfer-card.svg
    │   │   │   ├── trophy-icon.svg
    │   │   │   └── unmute-picture.svg
    │   │   ├── leagues
    │   │   │   ├── bronze-league.svg
    │   │   │   ├── diamond-league.svg
    │   │   │   ├── gold-league.svg
    │   │   │   ├── platinum-league.svg
    │   │   │   ├── predator-league.svg
    │   │   │   └── silver-league.svg
    │   │   └── stickers
    │   │       ├── block_duck.json
    │   │       ├── like_duck.json
    │   │       ├── money_duck.json
    │   │       ├── profile_duck.json
    │   │       ├── share_duck.json
    │   │       └── tournament_duck.json
    │   └── favicon.ico
    ├── src
    │   ├── App.vue
    │   ├── assets
    │   │   ├── base.css
    │   │   ├── icons
    │   │   │   ├── bonus-dollar-icon.svg
    │   │   │   ├── copy-icon.svg
    │   │   │   ├── edit-icon.svg
    │   │   │   ├── energy-icon.svg
    │   │   │   ├── free-play-icon.svg
    │   │   │   ├── info-icon.svg
    │   │   │   ├── light-icon.svg
    │   │   │   ├── lobby
    │   │   │   │   ├── classic-icon.svg
    │   │   │   │   └── transfer-icon.svg
    │   │   │   ├── main-menu-icon.svg
    │   │   │   ├── next-icon.svg
    │   │   │   ├── preferences-icon.svg
    │   │   │   ├── profile-menu-icon.svg
    │   │   │   ├── referrals-menu-icon.svg
    │   │   │   ├── settings-icon.svg
    │   │   │   ├── timer-icon.svg
    │   │   │   ├── ton-icon.svg
    │   │   │   ├── transactions
    │   │   │   │   ├── deposit-icon.svg
    │   │   │   │   ├── loss-icon.svg
    │   │   │   │   ├── referral-icon.svg
    │   │   │   │   ├── tournament-icon.svg
    │   │   │   │   ├── win-icon.svg
    │   │   │   │   └── withdraw-icon.svg
    │   │   │   ├── usdt-ton-icon.svg
    │   │   │   └── wallet-icon.svg
    │   │   └── main.css
    │   ├── components
    │   │   ├── Placeholder.vue
    │   │   ├── Stencil.vue
    │   │   ├── deposit-page
    │   │   │   └── ExpandableItem.vue
    │   │   ├── free-game-page
    │   │   │   ├── FreeGamePanel.vue
    │   │   │   ├── FreePlayButton.vue
    │   │   │   └── LobbyItem.vue
    │   │   ├── main-page
    │   │   │   ├── LeaguePanel.vue
    │   │   │   ├── PlayButton.vue
    │   │   │   ├── TournamentPanel.vue
    │   │   │   └── WalletPanel.vue
    │   │   ├── notification-layout
    │   │   │   └── NotificationItem.vue
    │   │   ├── profile-page
    │   │   │   └── ProfilePanel.vue
    │   │   ├── referrals-details-page
    │   │   │   └── ReferralsDetailsPanel.vue
    │   │   ├── referrals-page
    │   │   │   ├── FriendItem.vue
    │   │   │   └── ReferralsPanel.vue
    │   │   ├── tournament-page
    │   │   │   ├── LeaguePanel.vue
    │   │   │   └── PlayerItem.vue
    │   │   ├── wallet-page
    │   │   │   └── TransactionItem.vue
    │   │   └── withdraw-options-page
    │   │       └── CryptoItem.vue
    │   ├── events.ts
    │   ├── in-game
    │   │   ├── App.vue
    │   │   ├── components
    │   │   │   ├── CardsManager.vue
    │   │   │   ├── CardsManagerRef.ts
    │   │   │   ├── Footer.vue
    │   │   │   ├── Game.vue
    │   │   │   ├── Header.vue
    │   │   │   ├── MyPlayerController.vue
    │   │   │   ├── PlayersController.vue
    │   │   │   ├── popups
    │   │   │   │   ├── ChangeBetPopup.vue
    │   │   │   │   ├── DurakPopup.vue
    │   │   │   │   ├── EmotionPopup.vue
    │   │   │   │   ├── GameEndPopup.vue
    │   │   │   │   ├── KickPopup.vue
    │   │   │   │   ├── OfferToChangeBetPopup.vue
    │   │   │   │   ├── ReconnectPopup.vue
    │   │   │   │   ├── TryLeavePopup.vue
    │   │   │   │   └── WinnerPopup.vue
    │   │   │   └── prefabs
    │   │   │       ├── Card.vue
    │   │   │       ├── Player.vue
    │   │   │       ├── Profile.vue
    │   │   │       └── Sticker.vue
    │   │   ├── controllers
    │   │   │   ├── DeckController.ts
    │   │   │   ├── DraftController.ts
    │   │   │   ├── HandController.ts
    │   │   │   └── TableController.ts
    │   │   ├── network
    │   │   │   ├── EventService.ts
    │   │   │   ├── NetworkManager.ts
    │   │   │   ├── NetworkPacketProcessor.ts
    │   │   │   ├── PlayerSettingsStorage.ts
    │   │   │   ├── RequestPackets.ts
    │   │   │   └── ResponsePackets.ts
    │   │   └── utils
    │   │       ├── CardUtils.ts
    │   │       ├── ImageCache.ts
    │   │       ├── Localizator.ts
    │   │       └── Validator.ts
    │   ├── layouts
    │   │   ├── FooterLayout.vue
    │   │   ├── FullscreenLayout.vue
    │   │   ├── NotificationLayout.vue
    │   │   ├── PopupLayout.vue
    │   │   └── slider
    │   │       ├── SlideContainer.vue
    │   │       └── SliderLayout.vue
    │   ├── lottie-player.js
    │   ├── main.ts
    │   ├── router
    │   │   └── index.ts
    │   ├── services
    │   │   └── ApiService.ts
    │   ├── types
    │   │   └── global.d.ts
    │   └── views
    │       ├── pages
    │       │   ├── DepositOptionsPage.vue
    │       │   ├── DepositPage.vue
    │       │   ├── EditProfilePage.vue
    │       │   ├── FreeGamePage.vue
    │       │   ├── MainPage.vue
    │       │   ├── ProfilePage.vue
    │       │   ├── ReferralsDetailsPage.vue
    │       │   ├── ReferralsPage.vue
    │       │   ├── TournamentPage.vue
    │       │   ├── WalletPage.vue
    │       │   ├── WithdrawOptionsPage.vue
    │       │   └── WithdrawPage.vue
    │       └── popups
    │           ├── BonusBalanceInformationPopup.vue
    │           ├── FreeGamePopup.vue
    │           ├── FreeGameSettingsPopup.vue
    │           ├── GameSettingsPopup.vue
    │           ├── LeagueInformationPopup.vue
    │           ├── OnBoardingPopup.vue
    │           ├── ReferralsInformationPopup.vue
    │           ├── TournamentInformationPopup.vue
    │           ├── TournamentWinPopup.vue
    │           └── WithdrawConfirmationPopup.vue
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    └── vite.config.ts
```


###  Project Index
<details open>
	<summary><b><code>DURAK-FRONTEND/</code></b></summary>
	<details> <!-- __root__ Submodule -->
		<summary><b>__root__</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/tsconfig.node.json'>tsconfig.node.json</a></b></td>
				<td>- Configures TypeScript settings specifically for Node.js environments within the project, focusing on various configuration files like Vite, Vitest, Cypress, Nightwatch, Playwright, and ESLint<br>- It optimizes the development process by handling module resolution and type definitions, ensuring smooth integration and testing workflows without emitting output files.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/package-lock.json'>package-lock.json</a></b></td>
				<td>- The `package-lock.json` file for the "ton-durak-frontend" project serves a critical role in maintaining the stability and consistency of the project's dependencies across all development and production environments<br>- This file locks down the versions of each dependency listed, such as Vue, Axios, and GSAP, ensuring that all team members and deployment pipelines use the exact same versions<br>- This prevents discrepancies between environments and reduces bugs related to version mismatches<br>- The dependencies specified are essential for the project's functionality, supporting its frontend operations like routing (vue-router), HTTP requests (axios), and animations (gsap)<br>- This file is a foundational component of the project's architecture, ensuring reliable and predictable builds by managing dependency versions rigorously.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/tsconfig.json'>tsconfig.json</a></b></td>
				<td>- Manages TypeScript configuration settings for different parts of the application by referencing specific configurations for node and app environments<br>- It ensures that the appropriate TypeScript settings are applied depending on whether the context is a server-side or client-side execution, enhancing modularity and maintainability within the project's architecture.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/tsconfig.app.json'>tsconfig.app.json</a></b></td>
				<td>- Configures TypeScript settings for a Vue.js application, extending a base configuration to include and exclude specific directories and files for compilation<br>- It customizes path aliases and modifies compiler options to enhance build performance and manage type-checking rigor, ensuring efficient development workflows within the project's architecture.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/env.d.ts'>env.d.ts</a></b></td>
				<td>- Serves as a TypeScript declaration file that integrates Vite client types into the project, enhancing the development environment by enabling intelligent code completion and error checking specific to Vite's API<br>- This integration ensures developers can efficiently utilize Vite's features and tools within the TypeScript ecosystem, streamlining front-end development workflows.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/package.json'>package.json</a></b></td>
				<td>- Serves as the configuration hub for the "ton-durak-frontend" project, specifying project dependencies and scripts essential for development and production builds<br>- It orchestrates operations such as development server initiation, production build processes, and type-checking, leveraging tools like Vite, Vue, and TypeScript to streamline frontend development workflows.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/vite.config.ts'>vite.config.ts</a></b></td>
				<td>- Configures the build and development setup for a Vue.js application using Vite, enhancing the project with essential plugins like Vue support and development tools<br>- It establishes module resolution strategies, specifically setting up an alias for easier access to the source directory, streamlining development and build processes within the project's architecture.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/index.html'>index.html</a></b></td>
				<td>- Serves as the foundational HTML document for the "Карточная игра Дурак" web application, setting up the user interface with essential metadata, external font resources, and a script for Telegram integration<br>- It initializes the application by linking to the main TypeScript module, ensuring the app's functionality and style are correctly loaded and displayed.</td>
			</tr>
			</table>
		</blockquote>
	</details>
	<details> <!-- src Submodule -->
		<summary><b>src</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/events.ts'>events.ts</a></b></td>
				<td>- Defines and manages event-driven interactions within the application, utilizing the `mitt` library to handle custom events<br>- Specifically, it facilitates the display and hiding of popups, as well as the presentation of notifications, by defining an `Events` type with properties for each event's data structure and exporting a centralized event emitter.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/lottie-player.js'>lottie-player.js</a></b></td>
				<td>- The file `src/lottie-player.js` serves as a crucial component within the broader architecture of the project, primarily focused on providing the functionality necessary for embedding and controlling Lottie animations on web platforms<br>- This script is designed to be compatible with various module systems and environments, ensuring broad usability across different JavaScript environments.

The main purpose of this file is to establish an interface for the Lottie player, which includes loading, playing, pausing, and managing animations in a web context<br>- It supports asynchronous interaction with animation data, which is essential for performance and resource management in web applications<br>- The code structure indicates that it handles both modern and legacy systems by checking for and utilizing different module definitions and global standards.

This file is likely central to the project's functionality, as it directly pertains to the user-facing features allowing for the dynamic display and control of animations created with the Lottie framework<br>- Given its placement in the `src` directory and its fundamental role, it acts as a foundational piece that interacts with other parts of the system, possibly including UI components, animation data processing, and cross-platform compatibility layers.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/main.ts'>main.ts</a></b></td>
<td>- Initiates user authentication and application setup for a Vue-based web application<br>- It handles user data caching, theme setting based on Telegram's color scheme, and mounts the main Vue application component after successful authentication, integrating with the router and API services for enhanced user interaction and data management.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/App.vue'>App.vue</a></b></td>
<td>- Serves as the primary user interface component in a Vue.js application, orchestrating various layouts such as pop-ups, notifications, sliders, and footers<br>- It integrates with the Telegram WebApp for enhanced mobile interaction, handles navigation logic, and manages event-driven responses like tournament results and in-game decisions.</td>
</tr>
</table>
<details>
<summary><b>types</b></summary>
<blockquote>
<table>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/types/global.d.ts'>global.d.ts</a></b></td>
<td>- Expands the global `Window` object in the JavaScript environment to include custom properties relevant to user data, game state, and tournament results<br>- These enhancements facilitate the tracking of user sessions, game progress, onboarding processes, and tournament achievements across the application, ensuring a cohesive and interactive user experience.</td>
</tr>
</table>
</blockquote>
</details>
<details>
<summary><b>layouts</b></summary>
<blockquote>
<table>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/layouts/NotificationLayout.vue'>NotificationLayout.vue</a></b></td>
<td>- Manages and displays notifications within a Vue application, dynamically handling the creation, display, and automatic dismissal of up to three user notifications<br>- It integrates a global event listener to trigger notifications based on application-wide events, ensuring users receive timely updates as they navigate different parts of the application.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/layouts/PopupLayout.vue'>PopupLayout.vue</a></b></td>
<td>- Manages the display and behavior of various popups within the application, such as game settings, withdrawal confirmations, and tournament information<br>- It controls visibility, transitions, and dynamic component loading based on user interactions, ensuring a responsive and interactive user experience<br>- Additionally, it handles event-driven communication for showing and hiding popups effectively.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/layouts/FullscreenLayout.vue'>FullscreenLayout.vue</a></b></td>
<td>- Manages the dynamic rendering and transition animations of full-screen layouts within a Vue application, based on navigation changes<br>- It selectively displays components, excluding specified paths, and adjusts animations for forward and backward navigation, enhancing user experience with visual continuity and context-aware transitions.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/layouts/FooterLayout.vue'>FooterLayout.vue</a></b></td>
<td>- Manages the dynamic rendering and interaction of a footer layout in a Vue.js application, specifically handling navigation and visual transitions between different sections such as referrals, wallet, main, free game, and profile<br>- It includes responsive design adjustments and integrates with the Vue Router for seamless user navigation within the application.</td>
</tr>
</table>
<details>
<summary><b>slider</b></summary>
<blockquote>
<table>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/layouts/slider/SlideContainer.vue'>SlideContainer.vue</a></b></td>
<td>- SlideContainer.vue serves as a conditional wrapper component within the Vue.js application, specifically designed for managing the visibility of its child components<br>- It utilizes a prop to determine whether its content should be displayed, enabling dynamic UI updates based on the 'enabled' state<br>- This component is crucial for controlling the presentation layer's responsiveness and interactivity in the slider layout section of the architecture.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/layouts/slider/SliderLayout.vue'>SliderLayout.vue</a></b></td>
<td>- SliderLayout.vue orchestrates a dynamic, swipeable slider interface within the application, managing navigation and rendering of various components based on predefined routes<br>- It leverages Vue's reactivity and Swiper's functionality to handle transitions, route synchronization, and efficient loading of components, enhancing user interaction and visual flow across different views.</td>
</tr>
</table>
</blockquote>
</details>
</blockquote>
</details>
<details>
<summary><b>components</b></summary>
<blockquote>
<table>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/components/Placeholder.vue'>Placeholder.vue</a></b></td>
<td>- UniversalPlaceholder, a Vue component located in src/components, dynamically displays a loading placeholder<br>- It manages visibility based on the loading state, offering a default animated placeholder or a custom one through slots<br>- This component enhances user experience during data fetching or processing delays within the application's UI architecture.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/components/Stencil.vue'>Stencil.vue</a></b></td>
<td>- Stencil.vue serves as a customizable, interactive component within the Vue.js framework, enabling users to manipulate image elements through resizing and moving functionalities<br>- It integrates draggable and resizable interfaces, supports dynamic styling based on user interactions, and emits events to facilitate responsive adjustments in a broader application context.</td>
</tr>
</table>
<details>
<summary><b>profile-page</b></summary>
<blockquote>
<table>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/components/profile-page/ProfilePanel.vue'>ProfilePanel.vue</a></b></td>
<td>- ProfilePanel.vue serves as a user interface component within the application, primarily responsible for displaying and managing user profile information<br>- It features interactive elements like an edit button, dynamic loading indicators for image and data retrieval, and a structured display of user statistics, enhancing user interaction and data presentation on the profile page.</td>
</tr>
</table>
</blockquote>
</details>
<details>
<summary><b>tournament-page</b></summary>
<blockquote>
<table>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/components/tournament-page/PlayerItem.vue'>PlayerItem.vue</a></b></td>
<td>- PlayerItem.vue serves as a visual component within the tournament system, displaying individual player details such as avatar, name, ranking, and winnings<br>- It enhances user interaction by providing dynamic feedback on image loading and adjusting the display of win counts with appropriate suffixes based on the number of wins, thereby improving readability and user experience in the context of tournament standings.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/components/tournament-page/LeaguePanel.vue'>LeaguePanel.vue</a></b></td>
<td>- LeaguePanel.vue serves as a dynamic visual component within the tournament system, displaying league-specific badges, titles, and a countdown timer for tournament deadlines<br>- It also shows the prize pool amount, enhancing user engagement by providing real-time updates and visual feedback on tournament progress and status.</td>
</tr>
</table>
</blockquote>
</details>
<details>
<summary><b>free-game-page</b></summary>
<blockquote>
<table>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/components/free-game-page/LobbyItem.vue'>LobbyItem.vue</a></b></td>
<td>- LobbyItem.vue serves as a visual component within the game's user interface, displaying individual lobby entries for free games<br>- It dynamically showcases lobby details such as type, player count, and specific icons indicating the game mode, enhancing user interaction by providing essential lobby information and facilitating navigation through a visually appealing and interactive design.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/components/free-game-page/FreeGamePanel.vue'>FreeGamePanel.vue</a></b></td>
<td>- FreeGamePanel.vue serves as a user interface component within the gaming platform, displaying the current status of free game availability<br>- It visually communicates the number of games left, total games, and the time until the next game restoration<br>- Additionally, it includes interactive elements like an information popup and dynamic progress bars to enhance user engagement.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/components/free-game-page/FreePlayButton.vue'>FreePlayButton.vue</a></b></td>
<td>- FreePlayButton.vue serves as a user interface component within the application, enabling users to initiate a free game session<br>- It manages user interactions such as button clicks and pointer events, toggles loading states, and communicates with backend services to process the game initiation<br>- Additionally, it provides settings adjustments through an interactive icon.</td>
</tr>
</table>
</blockquote>
</details>
<details>
<summary><b>referrals-page</b></summary>
<blockquote>
<table>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/components/referrals-page/ReferralsPanel.vue'>ReferralsPanel.vue</a></b></td>
<td>- ReferralsPanel.vue serves as a user interface component within the application, facilitating the display and interaction with referral-related data<br>- It enables users to view their referral balance, claim payments, and invite others using a provided link, enhancing user engagement through interactive elements and real-time data updates.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/components/referrals-page/FriendItem.vue'>FriendItem.vue</a></b></td>
<td>- FriendItem.vue serves as a visual component within the referrals page, displaying individual friend entries with dynamic styling and interactive elements<br>- It features animated width adjustments, image loading states, and formatted display of currency, enhancing user engagement by presenting referral data in a visually appealing and responsive manner.</td>
</tr>
</table>
</blockquote>
</details>
<details>
<summary><b>withdraw-options-page</b></summary>
<blockquote>
<table>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/components/withdraw-options-page/CryptoItem.vue'>CryptoItem.vue</a></b></td>
<td>- CryptoItem.vue serves as a user interface component within the withdrawal options page, displaying individual cryptocurrency options<br>- It features a clickable panel that shows a cryptocurrency network's icon and name, enhancing user interaction by allowing navigation to further settings or details related to the chosen cryptocurrency network.</td>
</tr>
</table>
</blockquote>
</details>
<details>
<summary><b>wallet-page</b></summary>
<blockquote>
<table>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/components/wallet-page/TransactionItem.vue'>TransactionItem.vue</a></b></td>
<td>- Defines a Vue component for displaying transaction details within a wallet interface, including the transaction type, amount, and date<br>- It dynamically adjusts visual elements like icons and text color based on the transaction type, enhancing user experience by providing immediate visual feedback on the nature of each transaction (e.g., deposits, withdrawals, wins).</td>
</tr>
</table>
</blockquote>
</details>
<details>
<summary><b>main-page</b></summary>
<blockquote>
<table>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/components/main-page/WalletPanel.vue'>WalletPanel.vue</a></b></td>
<td>- WalletPanel.vue serves as a user interface component within the larger application, providing interactive displays of a user's financial balances<br>- It facilitates navigation to detailed wallet, deposit, and withdrawal pages, and offers a view of bonus balances with dynamic loading indicators<br>- This component enhances user engagement by integrating responsive design elements and interactive feedback mechanisms.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/components/main-page/TournamentPanel.vue'>TournamentPanel.vue</a></b></td>
<td>- TournamentPanel.vue serves as a dynamic user interface component within the application, displaying tournament details such as title, location, and a countdown timer<br>- It enhances user interaction by updating in real-time and navigating to detailed tournament information upon user action, effectively linking to other parts of the application through Vue's routing capabilities.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/components/main-page/PlayButton.vue'>PlayButton.vue</a></b></td>
<td>- PlayButton.vue serves as an interactive component within the application, enabling users to initiate a game with selected betting options<br>- It dynamically updates bet text based on user preferences stored locally, handles game initiation processes, and manages UI feedback during loading states<br>- Additionally, it includes settings access through an interactive icon, enhancing user control and customization.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/components/main-page/LeaguePanel.vue'>LeaguePanel.vue</a></b></td>
<td>- LeaguePanel.vue serves as a user interface component within the larger application, displaying dynamic league information based on user rank and progression<br>- It visually represents players' league standings through customized badges and a segmented progress bar, enhancing user engagement by providing interactive elements like clickable information pop-ups and real-time visual feedback on progression.</td>
</tr>
</table>
</blockquote>
</details>
<details>
<summary><b>notification-layout</b></summary>
<blockquote>
<table>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/components/notification-layout/NotificationItem.vue'>NotificationItem.vue</a></b></td>
<td>- NotificationItem.vue serves as a dynamic component within the application's notification system, enabling interactive user notifications<br>- It features customizable icons, titles, and subtitles, with optional animated stickers for visual enhancement<br>- The component supports touch interactions, allowing users to dismiss notifications through swipe gestures, thereby enhancing the user experience with responsive feedback.</td>
</tr>
</table>
</blockquote>
</details>
<details>
<summary><b>referrals-details-page</b></summary>
<blockquote>
<table>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/components/referrals-details-page/ReferralsDetailsPanel.vue'>ReferralsDetailsPanel.vue</a></b></td>
<td>- ReferralsDetailsPanel.vue serves as a visual component within the application, displaying a dynamic weekly statistics chart<br>- It animates and presents referral data over a seven-day period, enhancing user engagement by visually representing fluctuations in data through animated bars, which adjust in height based on the data's values.</td>
</tr>
</table>
</blockquote>
</details>
<details>
<summary><b>deposit-page</b></summary>
<blockquote>
<table>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/components/deposit-page/ExpandableItem.vue'>ExpandableItem.vue</a></b></td>
<td>- ExpandableItem.vue serves as a user interface component within the deposit-page directory, providing an interactive, collapsible panel that displays cryptocurrency transaction details<br>- It enhances user experience by allowing toggling visibility of wallet addresses, transaction specifics, and network fees, and includes functionality for copying the wallet address to the clipboard.</td>
</tr>
</table>
</blockquote>
</details>
</blockquote>
</details>
<details>
<summary><b>views</b></summary>
<blockquote>
<details>
<summary><b>pages</b></summary>
<blockquote>
<table>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/views/pages/MainPage.vue'>MainPage.vue</a></b></td>
<td>- Serves as the main user interface for a gaming platform, aggregating and displaying user-specific data across various panels such as league rankings, tournament details, and wallet balances<br>- It dynamically fetches and updates this data from a server, caches it locally for performance, and handles user interactions to ensure data is current and accurate.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/views/pages/TournamentPage.vue'>TournamentPage.vue</a></b></td>
<td>- TournamentPage.vue serves as the user interface for displaying tournament details and player rankings within a gaming platform<br>- It dynamically presents league information, a list of top players, and a personalized view for the user's own ranking and statistics, enhancing user engagement by facilitating interaction with tournament specifics and updates.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/views/pages/DepositPage.vue'>DepositPage.vue</a></b></td>
<td>- Facilitates cryptocurrency deposits by displaying a user interface where users can view and copy their wallet address, and observe transaction details such as minimum and recommended deposit amounts, and network fees<br>- It dynamically fetches and updates these details based on the selected cryptocurrency network.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/views/pages/WithdrawOptionsPage.vue'>WithdrawOptionsPage.vue</a></b></td>
<td>- WithdrawOptionsPage.vue serves as a user interface within the application, enabling users to select a cryptocurrency network for withdrawal purposes<br>- It integrates a component for displaying crypto options and utilizes routing for navigation<br>- The page also records page visits, enhancing user interaction tracking.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/views/pages/FreeGamePage.vue'>FreeGamePage.vue</a></b></td>
<td>- FreeGamePage.vue serves as a user interface for displaying a free game lobby system within a gaming platform<br>- It integrates components to show available game sessions, track the number of games left, and manage session restoration times<br>- The page also dynamically lists different game lobbies, enhancing user interaction and game session visibility.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/views/pages/ReferralsDetailsPage.vue'>ReferralsDetailsPage.vue</a></b></td>
<td>- ReferralsDetailsPage.vue serves as a user interface component within the application, displaying detailed referral transaction histories and graphical data analytics<br>- It fetches and visualizes transaction data and trends related to user referrals, enhancing user engagement by providing insights into their referral activities.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/views/pages/EditProfilePage.vue'>EditProfilePage.vue</a></b></td>
<td>- Enables users to edit their profile by updating their name and profile picture within a Vue.js framework<br>- It incorporates image cropping functionality and input validation with timers to restrict frequent changes<br>- Successful updates redirect to the profile page with a notification, while failures trigger error alerts.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/views/pages/ProfilePage.vue'>ProfilePage.vue</a></b></td>
<td>- ProfilePage.vue serves as the user profile interface within the application, displaying personalized user data and statistics through a ProfilePanel component<br>- It facilitates navigation to a wallet section via a clickable panel and manages data fetching, caching, and updating processes to ensure the profile displays current and accurate information.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/views/pages/DepositOptionsPage.vue'>DepositOptionsPage.vue</a></b></td>
<td>- DepositOptionsPage.vue serves as a user interface within the application, enabling users to select a cryptocurrency network for deposit purposes<br>- It integrates components for displaying crypto options and utilizes navigation and API services to enhance user interaction and track page visits, respectively, contributing to the app's functionality in managing cryptocurrency transactions.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/views/pages/ReferralsPage.vue'>ReferralsPage.vue</a></b></td>
<td>- ReferralsPage.vue serves as a user interface for displaying referral statistics and top referrer rankings within the application<br>- It fetches and displays user-specific referral data, including balances and links, and lists top referrers with details like earnings and rankings, enhancing user engagement through a competitive visual leaderboard.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/views/pages/WithdrawPage.vue'>WithdrawPage.vue</a></b></td>
<td>- Manages cryptocurrency withdrawal interactions for users, enabling them to specify a wallet address, input withdrawal amounts, and confirm transactions<br>- It dynamically adjusts input fields based on the user's wallet status and balance, provides real-time feedback on minimum amounts and fees, and handles form submissions with validation to ensure data integrity.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/views/pages/WalletPage.vue'>WalletPage.vue</a></b></td>
<td>- WalletPage.vue serves as the user interface for displaying a user's financial overview and transaction history in a web application<br>- It integrates components for visualizing wallet balance, bonuses, and a detailed list of transactions, fetching and handling data dynamically from an API to ensure real-time accuracy and interaction.</td>
</tr>
</table>
</blockquote>
</details>
<details>
<summary><b>popups</b></summary>
<blockquote>
<table>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/views/popups/WithdrawConfirmationPopup.vue'>WithdrawConfirmationPopup.vue</a></b></td>
<td>- Manages the user interaction for confirming cryptocurrency withdrawals, displaying transaction details such as the amount, network fee, and total after fees<br>- It integrates biometric authentication for security and communicates with backend services to execute and confirm the transaction, updating the user through notifications on success or failure.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/views/popups/FreeGameSettingsPopup.vue'>FreeGameSettingsPopup.vue</a></b></td>
<td>- Manages the user interface and functionality for configuring settings in a free game mode within the application<br>- It allows users to select the number of players and game rules, persisting these preferences locally<br>- Changes are saved and communicated across the application via event emissions, enhancing user experience by remembering previous selections.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/views/popups/LeagueInformationPopup.vue'>LeagueInformationPopup.vue</a></b></td>
<td>- Provides a user interface for displaying league information in a gaming application, enabling users to view different league tiers and understand the criteria and benefits of advancing to higher leagues<br>- It includes interactive elements for closing the popup and tracks user engagement through an API call upon component mounting.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/views/popups/ReferralsInformationPopup.vue'>ReferralsInformationPopup.vue</a></b></td>
<td>- Provides a user interface for displaying information about the referral system in a popup format<br>- It explains the commission structure based on player leagues and stakes, detailing how referrals generate earnings for users<br>- The component also handles the lifecycle of the popup, including its display and automatic reporting of user interactions to a backend service.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/views/popups/TournamentInformationPopup.vue'>TournamentInformationPopup.vue</a></b></td>
<td>- Provides a user interface for displaying tournament information within the application<br>- It features a popup that outlines weekly tournament details and rewards, enhancing user engagement by informing players about potential bonuses<br>- The component also tracks user interaction with the popup for analytics purposes and allows users to close the popup interactively.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/views/popups/BonusBalanceInformationPopup.vue'>BonusBalanceInformationPopup.vue</a></b></td>
<td>- Provides a user interface for displaying bonus balance information in a popup format within the game<br>- It educates players on how bonus balances work, their non-withdrawable nature, and their use for betting<br>- The component also tracks user interaction by logging visits and allows users to close the popup, enhancing user engagement and data collection.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/views/popups/OnBoardingPopup.vue'>OnBoardingPopup.vue</a></b></td>
<td>- Provides an interactive onboarding experience for users through a series of animated slides within a Vue.js component<br>- Each slide features dynamic content including icons, titles, and text aimed at educating users about earning opportunities and features in the application<br>- Navigation through slides and tracking of user interactions with the onboarding process are managed via integrated API calls and routing.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/views/popups/TournamentWinPopup.vue'>TournamentWinPopup.vue</a></b></td>
<td>- Displays a popup in a Vue.js application to celebrate a user's victory in a tournament, showing their rank, place, number of wins, gap from the previous position, and reward<br>- It dynamically fetches and displays a league badge based on the user's rank and provides a button to close the popup.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/views/popups/FreeGamePopup.vue'>FreeGamePopup.vue</a></b></td>
<td>- FreeGamePopup.vue serves as a user interface component within the application, presenting a popup that promotes free gameplay options in the game "Дурак"<br>- It informs users about the energy-based game mechanics and encourages interaction through game initiation or lobby creation<br>- The component also handles user interactions to close the popup and logs the visit for analytics purposes.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/views/popups/GameSettingsPopup.vue'>GameSettingsPopup.vue</a></b></td>
<td>- GameSettingsPopup.vue serves as the user interface for configuring game settings within the application<br>- It allows players to select the number of participants, set betting amounts, and choose game rules<br>- Changes are saved locally and can be dynamically updated based on available options fetched from an external service, enhancing user customization and interaction.</td>
</tr>
</table>
</blockquote>
</details>
</blockquote>
</details>
<details>
<summary><b>services</b></summary>
<blockquote>
<table>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/services/ApiService.ts'>ApiService.ts</a></b></td>
<td>- ApiService.ts establishes a centralized communication layer for interacting with a remote API, managing authentication, token storage, and data retrieval across various application screens<br>- It handles API requests, token refresh mechanisms, and standardizes responses to ensure consistent data handling throughout the application.</td>
</tr>
</table>
</blockquote>
</details>
<details>
<summary><b>in-game</b></summary>
<blockquote>
<table>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/App.vue'>App.vue</a></b></td>
<td>- Manages the main game interface in the application, initializing and handling game scenes, network connections, and user interactions<br>- It dynamically adjusts to user settings and preloads necessary assets, ensuring smooth transitions and updates during gameplay<br>- Additionally, it manages event listeners for game state changes and network reconnections.</td>
</tr>
</table>
<details>
<summary><b>network</b></summary>
<blockquote>
<table>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/network/PlayerSettingsStorage.ts'>PlayerSettingsStorage.ts</a></b></td>
<td>- PlayerSettingsStorage serves as a centralized repository for managing and updating player-specific settings and states within a gaming environment<br>- It utilizes event-driven updates to synchronize player data such as IDs, lobby associations, bids, and game types, ensuring consistent and accurate gameplay states across different game sessions.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/network/ResponsePackets.ts'>ResponsePackets.ts</a></b></td>
<td>- Defines a series of interfaces for network response packets in a gaming environment, facilitating server-client communication<br>- Each packet type, such as WelcomePacket, EndGamePacket, and ReconnectionPacket, carries specific game state information and player actions, crucial for synchronizing game states across networked clients.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/network/EventService.ts'>EventService.ts</a></b></td>
<td>- EventService.ts serves as the central event management system within the game's network layer, facilitating communication and state synchronization across different components<br>- It defines a comprehensive set of game-related events, manages subscriptions, and handles the broadcasting of these events to support dynamic game flow and real-time updates in player interactions and game state changes.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/network/RequestPackets.ts'>RequestPackets.ts</a></b></td>
<td>- Defines a series of network request packet classes for in-game actions, such as joining games, pinging, emoting, betting, muting, and game state changes<br>- Each class extends a base request class that serializes objects into JSON format for server communication, facilitating various player interactions and game mechanics within a multiplayer environment.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/network/NetworkPacketProcessor.ts'>NetworkPacketProcessor.ts</a></b></td>
<td>- Manages and processes various network packets within the game's online interactions, translating incoming JSON data into actionable game events<br>- It handles a wide range of game states and player actions, such as starting games, updating tables, and managing player reconnections, ensuring the game's network layer communicates effectively with the gameplay mechanics.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/network/NetworkManager.ts'>NetworkManager.ts</a></b></td>
<td>- NetworkManager orchestrates real-time network communication for an in-game environment, managing WebSocket connections, handling reconnections, and processing network packets<br>- It ensures continuous interaction by maintaining heartbeat checks and manages user sessions by handling join and leave requests, as well as token refresh operations.</td>
</tr>
</table>
</blockquote>
</details>
<details>
<summary><b>components</b></summary>
<blockquote>
<table>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/components/PlayersController.vue'>PlayersController.vue</a></b></td>
<td>- Manages the dynamic display and interaction of player components within a multiplayer game environment<br>- It handles player data updates, including statuses, nicknames, and card counts, and coordinates animations for card movements<br>- The component also responds to game events to adjust player information and UI elements in real-time, enhancing the gaming experience.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/components/Footer.vue'>Footer.vue</a></b></td>
<td>- Manages the interactive footer component within the game's user interface, featuring dynamic action buttons that respond to game state changes<br>- It integrates animation effects, handles user interactions, and communicates with the network layer to update game states and bets based on player actions, enhancing the gameplay experience through visual feedback and real-time updates.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/components/Game.vue'>Game.vue</a></b></td>
<td>- Serves as the central visual and interaction hub for a gaming application, orchestrating various game components and popups such as game end notifications and betting options<br>- It manages the lifecycle of game controllers like hand, table, deck, and draft, ensuring proper initialization and cleanup of these elements to maintain game state and performance.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/components/Header.vue'>Header.vue</a></b></td>
<td>- Provides a dynamic header component for an in-game interface, displaying player balance and game type icons conditionally based on the game's state and type<br>- It integrates with the game's event system to update UI elements in response to game events, enhancing user interaction and providing real-time feedback within the gaming environment.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/components/MyPlayerController.vue'>MyPlayerController.vue</a></b></td>
<td>- Manages the interactive player profile component within the game, updating player details such as nickname, status, and card count based on game events<br>- It also controls the display of emotions through an emote icon, enhancing player interaction by allowing emotions to be shown or hidden during gameplay.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/components/CardsManagerRef.ts'>CardsManagerRef.ts</a></b></td>
<td>- Manages a centralized reference to the CardsManager component within the game's architecture, enabling other components to access and modify the state of card management consistently<br>- It provides methods to set, retrieve, and clear the reference, ensuring robust handling and error logging for state management of game cards.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/components/CardsManager.vue'>CardsManager.vue</a></b></td>
<td>- Manages the dynamic rendering and interaction of card components within a game environment, handling card display properties, animations, and state transitions based on game events<br>- It integrates utility functions for card validation and image caching, and responds to game-specific events such as setting trump cards and updating visible icons.</td>
</tr>
</table>
<details>
<summary><b>prefabs</b></summary>
<blockquote>
<table>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/components/prefabs/Profile.vue'>Profile.vue</a></b></td>
<td>- Manages the visual representation and interactivity of user profiles within the game, including dynamic display of profile images, status updates, and timers<br>- It integrates animations for status changes and emotes, supports image caching for performance, and handles real-time updates through event listeners to reflect game state changes accurately.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/components/prefabs/Sticker.vue'>Sticker.vue</a></b></td>
<td>- Manages the display and control of animated stickers within the game, specifically handling the lifecycle and interactions of a sticker component<br>- It dynamically adjusts sticker visuals based on provided properties, supports play, pause, and stop functionalities, and ensures proper resource cleanup on component unmount to optimize performance and memory usage.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/components/prefabs/Card.vue'>Card.vue</a></b></td>
<td>- Manages interactive card elements within a digital card game, enabling dynamic visual representation and user interaction<br>- It handles card dragging, positioning, and animations using Vue and GSAP for smooth transitions<br>- Additionally, it integrates image caching for efficient loading and updates card appearance based on game state changes, ensuring responsive and engaging gameplay.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/components/prefabs/Player.vue'>Player.vue</a></b></td>
<td>- Manages the visual and interactive aspects of player components within the game, including dynamic display of player status, profile information, and card count<br>- It integrates network interactions for muting functionality, leverages animations for state transitions, and handles image caching for performance optimization<br>- This component enhances user interaction and visual feedback in the game environment.</td>
</tr>
</table>
</blockquote>
</details>
<details>
<summary><b>popups</b></summary>
<blockquote>
<table>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/components/popups/ChangeBetPopup.vue'>ChangeBetPopup.vue</a></b></td>
<td>- Manages the interactive betting interface within the game, allowing users to select and modify their bets dynamically<br>- It responds to game events by showing or hiding the popup, updates available bets, and communicates bet selections through the network<br>- The component ensures a smooth user experience with animations and immediate feedback on bet adjustments.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/components/popups/OfferToChangeBetPopup.vue'>OfferToChangeBetPopup.vue</a></b></td>
<td>- Manages interactive user prompts within the game, specifically handling bet change requests<br>- It displays a popup allowing players to accept or decline an opponent's proposed new bet, leveraging animations for visibility effects and network communication to send player responses<br>- Additionally, it ensures relevant icons are loaded and displayed correctly in the popup.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/components/popups/DurakPopup.vue'>DurakPopup.vue</a></b></td>
<td>- Manages the display and behavior of a popup notification within the game, specifically for the "Durak" event<br>- Utilizes Vue.js for reactivity and GSAP for animations, ensuring the popup appears dynamically and is visually engaging<br>- Integrates with the EventService to listen for specific game events, triggering the popup's visibility and animation sequences accordingly.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/components/popups/EmotionPopup.vue'>EmotionPopup.vue</a></b></td>
<td>- EmotionPopup.vue facilitates interactive communication in-game by displaying a popup with selectable emoticons<br>- Users can express emotions through stickers, which are sent to other players via network requests<br>- The component manages visibility, animation effects, and interaction cooldowns, enhancing the user experience by providing a dynamic and responsive way to share feelings during gameplay.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/components/popups/WinnerPopup.vue'>WinnerPopup.vue</a></b></td>
<td>- WinnerPopup.vue serves as a dynamic visual component within the game's interface, displaying celebratory graphics and information when a player wins<br>- It utilizes animations to enhance user experience, showing a trophy and fire icons based on the player's winning streak<br>- The component responds to specific game events to appear and disappear, integrating seamlessly with the game's event-driven architecture.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/components/popups/GameEndPopup.vue'>GameEndPopup.vue</a></b></td>
<td>- Manages the display and interaction logic for the game's end-of-play popup in a Vue component, offering players options to either continue playing or exit the game<br>- It integrates animation effects for showing and hiding the popup, handles user responses through buttons, and communicates with the network layer for game state management.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/components/popups/KickPopup.vue'>KickPopup.vue</a></b></td>
<td>- KickPopup.vue serves as a user interface component within the game, displaying a modal popup when a player is kicked due to balance depletion or time expiration<br>- It dynamically loads and displays relevant icons, provides a contextual message, and facilitates game exit through network management interactions, enhancing user experience during critical game events.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/components/popups/ReconnectPopup.vue'>ReconnectPopup.vue</a></b></td>
<td>- Manages the display and behavior of a reconnection popup within the game's user interface, utilizing animation effects for visibility transitions<br>- It dynamically loads visual assets, responds to network reconnection events, and provides user feedback during network interruptions<br>- The component enhances user experience by managing connectivity issues transparently and interactively.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/components/popups/TryLeavePopup.vue'>TryLeavePopup.vue</a></b></td>
<td>- Manages the interactive confirmation popup for players considering leaving a game session in the application<br>- It displays potential penalties for exiting and offers options to either continue playing or confirm the exit<br>- The component integrates animation effects for visibility transitions and interacts with network services to handle game exit logistics.</td>
</tr>
</table>
</blockquote>
</details>
</blockquote>
</details>
<details>
<summary><b>controllers</b></summary>
<blockquote>
<table>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/controllers/TableController.ts'>TableController.ts</a></b></td>
<td>- The `TableController.ts` file within the codebase plays a crucial role in managing the interactive gameplay elements of a card game<br>- It primarily handles the dynamics of the game table, such as updating and caching the cards on the table, managing player states, and tracking the number of cards each player holds<br>- This controller integrates closely with the network layer to process game events (e.g., attacks, defenses) and synchronize game state changes across players through the `EventService`.

Key functionalities include:
- Maintaining a real-time updated view of the cards on the table.
- Responding to game events by updating internal states and player views accordingly.
- Interacting with utility classes like `CardUtils` for card-related operations and `Validator` for checking the validity of game moves.

This file is essential for ensuring that the game's interactive elements are responsive and consistent with the game's rules and state changes, contributing significantly to the overall user experience and gameplay integrity.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/controllers/HandController.ts'>HandController.ts</a></b></td>
<td>- HandController manages the visual and state aspects of card handling in the game, responding to various game events such as changes in hand cards, game refreshes, and game conclusions<br>- It dynamically updates, restores, and clears player hand cards, leveraging animations and interactions with a centralized card management system to reflect game state changes accurately and efficiently.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/controllers/DraftController.ts'>DraftController.ts</a></b></td>
<td>- DraftController manages the lifecycle and interactions of draft cards within the game<br>- It subscribes to game events to handle card movements to the discard pile and the clearing of cards at game end<br>- It utilizes utility classes for card management and validation, ensuring that card states are updated and managed efficiently throughout gameplay.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/controllers/DeckController.ts'>DeckController.ts</a></b></td>
<td>- DeckController manages the dynamic aspects of a card deck within a gaming environment, handling operations such as updating card counts, setting trump cards, and adjusting card positions on the screen<br>- It integrates closely with event handling and card management systems to ensure responsive and accurate gameplay updates, including cleanup tasks at game end.</td>
</tr>
</table>
</blockquote>
</details>
<details>
<summary><b>utils</b></summary>
<blockquote>
<table>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/utils/Validator.ts'>Validator.ts</a></b></td>
<td>- Validator.ts serves as a central utility within the game's architecture, managing gameplay rules for card interactions<br>- It determines the legality of attack, defense, and card transfer actions based on the current game state, including the trump suit and completion status of a round, ensuring adherence to the game's strategic elements and flow.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/utils/CardUtils.ts'>CardUtils.ts</a></b></td>
<td>- CardUtils.ts serves as a utility module within the game's architecture, providing essential functionalities for card manipulation and management<br>- It defines card suits, ranks, and images, facilitates card parsing and naming, and supports the generation of card-related data structures necessary for gameplay dynamics across various game locations.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/utils/Localizator.ts'>Localizator.ts</a></b></td>
<td>- Localizator.ts serves as a centralized utility for language translation within the game, specifically supporting Russian<br>- It facilitates the dynamic retrieval of localized text for game elements and interface labels, ensuring adaptability and enhancing user experience for Russian-speaking players by providing translations for common game actions and buttons.</td>
</tr>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/in-game/utils/ImageCache.ts'>ImageCache.ts</a></b></td>
<td>- ImageCache.ts serves as a centralized image management utility within the game's architecture, efficiently handling the loading, caching, and retrieval of image resources<br>- It ensures images are preloaded and stored for quick access, supporting both individual and batch operations, and integrates browser cache interaction to optimize performance and resource management.</td>
</tr>
</table>
</blockquote>
</details>
</blockquote>
</details>
<details>
<summary><b>router</b></summary>
<blockquote>
<table>
<tr>
<td><b><a href='https://github.com/open-altterra/durak-frontend/blob/master/src/router/index.ts'>index.ts</a></b></td>
<td>- Defines and configures the navigation routes for a Vue.js application, linking various user interface components to specific URLs<br>- It facilitates user navigation across different pages like Main, Profile, Tournament, Wallet, and several transaction-related pages, ensuring a structured and intuitive user experience within the web application.</td>
</tr>
</table>
</blockquote>
</details>
</blockquote>
</details>
</details>


