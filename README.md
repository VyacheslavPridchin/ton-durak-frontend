<p align="center"><h1 align="center">DURAK FRONTEND</h1></p>

<br>

##  Table of Contents

- [ Overview](#-overview)
- [ Features](#-features)
- [ Project Structure](#-project-structure)
  - [ Project Index](#-project-index)

---

##  Overview

**Durak** is a modern mobile web-based card game built as a Single Page Application (SPA) using **Vue 3 Composition API** and **TypeScript**. This project reimagines the classic card game with a strong focus on social interaction, customization, and scalable multiplayer gameplay.

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


---

##  Features

|      | Feature         | Summary       |
| :--- | :---:           | :---          |
| ⚙️  | **Architecture**  | <ul><li>Utilizes Vue.js, a progressive JavaScript framework for building user interfaces.</li><li>Adopts a modular architecture with components managed through Vue Router for SPA capabilities.</li><li>Uses Vite as a build tool, enhancing development experience with fast rebuilds.</li></ul> |
| 🔩 | **Code Quality**  | <ul><li>Typescript is used for static type checking, improving code reliability and maintainability.</li><li>Includes various configuration files like `tsconfig` to enforce coding standards and optimize setups.</li><li>Utilizes ESLint for code linting to maintain code quality and consistency.</li></ul> |
| 📄 | **Documentation** | <ul><li>Documentation includes detailed commands for installation, usage, and testing.</li><li>Uses npm as a package manager, documented in `package.json` and `package-lock.json`.</li><li>Language usage is predominantly Vue.js, with TypeScript and JavaScript support.</li></ul> |
| 🔌 | **Integrations**  | <ul><li>Integrates with libraries like Axios for HTTP requests and GSAP for animations.</li><li>Uses Vue Router for routing and state management across the application.</li></ul> |
| 🧩 | **Modularity**    | <ul><li>Highly modular structure with Vue components, enhancing reusability and separation of concerns.</li><li>Uses Vue Router to manage component-based routing.</li><li>Modular configuration files for different environments and purposes (e.g., `tsconfig.node.json`).</li></ul> |
| ⚡️  | **Performance**   | <ul><li>Uses Vite for efficient and fast builds, significantly improving development performance.</li><li>Vue.js framework optimizes UI rendering and responsiveness.</li><li>Dependency management through `package-lock.json` ensures consistent performance across environments.</li></ul> |

---

##  Project Structure

```sh
└── ton-durak-frontend/
    ├── README.md
    ├── env.d.ts
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── public
    │   ├── assets
    │   │   ├── cards
    │   │   │   └── skins
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
    │   │   │   ├── main-menu-icon.svg
    │   │   │   ├── next-icon.svg
    │   │   │   ├── preferences-icon.svg
    │   │   │   ├── profile-menu-icon.svg
    │   │   │   ├── referrals-menu-icon.svg
    │   │   │   ├── settings-icon.svg
    │   │   │   ├── timer-icon.svg
    │   │   │   ├── ton-icon.svg
    │   │   │   ├── transactions
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
    │   ├── game
    │   │   ├── App.vue
    │   │   ├── components
    │   │   │   └── game
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
    │   │       ├── LogInterceptor.ts
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
    │       ├── Test.vue
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
				<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/tsconfig.node.json'>tsconfig.node.json</a></b></td>
				<td>- Configures TypeScript settings specifically for Node.js environments within the project, focusing on various configuration files like Vite, Vitest, Cypress, Nightwatch, Playwright, and ESLint<br>- It optimizes the development process by setting up compiler options that prevent output emission and enhance module resolution, tailored for a Node-centric development workflow.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/package-lock.json'>package-lock.json</a></b></td>
				<td>- The `package-lock.json` file in the "ton-durak-frontend" project serves a critical role in managing and ensuring the consistency of dependencies used throughout the application's development lifecycle<br>- This file locks the versions of all packages and their dependencies, ensuring that every installation or deployment of the project uses the exact same versions, thereby avoiding discrepancies that might arise from version updates or compatibility issues.

This file directly supports the project's stability and reliability by preventing the introduction of untested updates that could potentially break existing functionality<br>- It is an essential component of the project's infrastructure, particularly in a collaborative development environment where multiple developers might introduce changes<br>- The dependencies listed, such as Vue.js for the frontend framework, Axios for HTTP requests, and GSAP for animations, highlight the project's reliance on these libraries for its core functionality.

Overall, the `package-lock.json` file is fundamental to maintaining the operational integrity of the "ton-durak-frontend" codebase, ensuring that all developers and deployments are aligned with a consistent set of dependencies that are known to work well together.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/tsconfig.json'>tsconfig.json</a></b></td>
				<td>- Serves as a central configuration hub within the TypeScript project, orchestrating the compilation settings by referencing specific configurations for different parts of the application<br>- It links to separate configurations for node and application environments, ensuring modular management and clarity in project setup across various development contexts.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/tsconfig.app.json'>tsconfig.app.json</a></b></td>
				<td>- Configures TypeScript settings specifically for the Vue application within the project, extending a base configuration for DOM environments<br>- It includes TypeScript definitions and all Vue components in the source directory while excluding test files<br>- Adjustments to path aliases and compiler options enhance build performance and project structure clarity.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/env.d.ts'>env.d.ts</a></b></td>
				<td>- Serves as a TypeScript declaration file within the project, specifically referencing Vite client types to enhance development efficiency by enabling type checking and IntelliSense for Vite-specific features<br>- It integrates seamlessly with the broader codebase, ensuring that Vite configurations and client interactions are type-safe and easier to manage during development.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/package.json'>package.json</a></b></td>
				<td>- Defines the configuration and dependencies for the "ton-durak-frontend" project, setting up essential scripts for development, building, and previewing the application<br>- It specifies project dependencies crucial for its operation, including Vue.js frameworks and tools for enhancing development efficiency and performance, such as Vite and TypeScript.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/vite.config.ts'>vite.config.ts</a></b></td>
				<td>- Configures the build and development setup for a Vue.js project using Vite<br>- It integrates Vue-specific plugins and sets up module resolution aliases to streamline development<br>- The configuration enhances the project's ability to efficiently handle Vue components and supports the inclusion of Vue developer tools for better debugging and development experience.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/index.html'>index.html</a></b></td>
				<td>- Serves as the entry point for the TON DURAK web application, establishing the foundational HTML structure and linking essential resources<br>- It integrates custom fonts, sets up a responsive viewport, and incorporates a Telegram Web App script, preparing the environment for the main TypeScript application loaded from `/src/main.ts`.</td>
			</tr>
			</table>
		</blockquote>
	</details>
	<details> <!-- src Submodule -->
		<summary><b>src</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/events.ts'>events.ts</a></b></td>
				<td>- Manages event-driven interactions within the application, facilitating communication across different components<br>- Specifically, it handles the display and concealment of popups, as well as the presentation of notifications<br>- Utilizing the mitt library, it defines an event schema and creates an emitter for these defined events, enhancing modular architecture and event management efficiency.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/lottie-player.js'>lottie-player.js</a></b></td>
				<td>- The `src/lottie-player.js` file is a crucial component of the project, serving as the implementation of a Lottie player<br>- Lottie is a popular library for rendering animation files, typically JSON data exported from Adobe After Effects using the Bodymovin plugin<br>- This JavaScript file is designed to facilitate the integration and control of Lottie animations within web applications.

The main purpose of this file is to provide an interface for web developers to easily embed and manage animations on their websites<br>- It handles the loading, playing, pausing, and other animation control functionalities, making it a key asset for enhancing user interfaces with rich, interactive animations.

Given the project's structure, this file likely interacts with other modules that could be responsible for additional UI components, utilities, or services within the application<br>- The architecture is set up to support modular development, where `lottie-player.js` acts as a standalone module that can be integrated seamlessly into broader application frameworks.

Overall, `src/lottie-player.js` is essential for developers looking to leverage animated content in their projects, providing a robust and flexible toolset for working with Lottie animations.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/main.ts'>main.ts</a></b></td>
				<td>- Initiates user authentication and application setup in a Vue-based web environment<br>- It handles user data caching, theme setting based on Telegram's color scheme, and mounts the main Vue application after successful authentication, interfacing with an API service for authentication and user data management.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/App.vue'>App.vue</a></b></td>
				<td>- Serves as the primary user interface component in a Vue.js application, orchestrating various layouts such as popups, notifications, sliders, and footers<br>- It integrates with the Telegram WebApp for enhanced mobile interactions and manages navigation and session states based on user interactions and game events, ensuring a dynamic and responsive user experience.</td>
			</tr>
			</table>
			<details>
				<summary><b>types</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/types/global.d.ts'>global.d.ts</a></b></td>
						<td>- Defines global TypeScript interfaces for the `Window` object, enhancing it with properties specific to user data, game state, and tournament results<br>- These additions facilitate the management of user sessions, game progress tracking, and display of tournament achievements across the application, ensuring a cohesive user experience and data consistency throughout the platform.</td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>layouts</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/layouts/NotificationLayout.vue'>NotificationLayout.vue</a></b></td>
						<td>- Manages and displays notifications within a Vue application, dynamically handling the creation, display, and automatic dismissal of notification messages<br>- It supports a limited number of simultaneous notifications, automatically removing the oldest to make room for new ones, and clears all notifications when navigating to a new route.</td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/layouts/PopupLayout.vue'>PopupLayout.vue</a></b></td>
						<td>- Manages the display and behavior of various popups within the application, such as game settings, withdrawal confirmations, and tournament information<br>- It dynamically loads and unloads components based on user interactions, ensuring a responsive and interactive user experience<br>- The layout also handles animations and visibility states, enhancing the UI's aesthetic and functional aspects.</td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/layouts/FullscreenLayout.vue'>FullscreenLayout.vue</a></b></td>
						<td>- Manages the dynamic rendering and transition animations of full-screen components within the application, based on navigation changes<br>- It selectively displays components, excluding specific paths, and adjusts animations for forward and backward navigation, enhancing user experience with smooth visual transitions<br>- This functionality is crucial for maintaining a fluid and responsive UI across different views.</td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/layouts/FooterLayout.vue'>FooterLayout.vue</a></b></td>
						<td>- Manages the dynamic rendering and interaction of a navigational footer in a Vue.js application, adapting visibility and style based on the user's current route<br>- It includes clickable icons for navigation, animated highlights for active sections, and responsiveness to changes in viewport size, enhancing user experience and interface fluidity.</td>
					</tr>
					</table>
					<details>
						<summary><b>slider</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/layouts/slider/SlideContainer.vue'>SlideContainer.vue</a></b></td>
								<td>- SlideContainer.vue serves as a conditional display component within the Vue.js framework, specifically designed for the slider layout<br>- It controls the visibility of its child components based on the 'enabled' property, ensuring that elements are only rendered when required, enhancing the application's performance and user interface responsiveness.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/layouts/slider/SliderLayout.vue'>SliderLayout.vue</a></b></td>
								<td>- SliderLayout.vue orchestrates a dynamic, swipeable slider interface within the application, managing navigation and rendering of various components based on predefined routes<br>- It leverages Vue's reactivity and Swiper's functionality to handle transitions, route synchronization, and efficient loading of components, enhancing user interaction and visual flow across different views.</td>
							</tr>
							</table>
						</blockquote>
					</details>
				</blockquote>
			</details>
			<details>
				<summary><b>game</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/App.vue'>App.vue</a></b></td>
						<td>- App.vue serves as the primary interface component in the game's architecture, orchestrating user interactions and visual elements<br>- It initializes and manages the game's state based on URL parameters, handles network connections, preloads necessary images, and responds to both internal and external events to maintain the game environment's responsiveness and stability.</td>
					</tr>
					</table>
					<details>
						<summary><b>network</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/network/PlayerSettingsStorage.ts'>PlayerSettingsStorage.ts</a></b></td>
								<td>- PlayerSettingsStorage serves as a centralized repository for managing and updating player-specific settings and states within a gaming network<br>- It utilizes a singleton pattern to ensure a single instance manages subscriptions to various game events, updating player IDs, lobby details, bids, and game types, while also handling player coordinates and card ownership.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/network/ResponsePackets.ts'>ResponsePackets.ts</a></b></td>
								<td>- Defines a series of interfaces for response packets received from the server within the game's networking layer<br>- These packets facilitate various game state updates, including player actions, game starts, round ends, and reconnections, ensuring synchronized state management and interaction flow across the networked multiplayer environment.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/network/EventService.ts'>EventService.ts</a></b></td>
								<td>- EventService.ts manages event-driven communication within the game's network layer, utilizing a custom event system to handle various game states and actions like starting the application, managing player connections, and updating game elements<br>- It defines a comprehensive set of game-related events and facilitates the registration and deregistration of event handlers, ensuring modular and responsive game interactions.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/network/RequestPackets.ts'>RequestPackets.ts</a></b></td>
								<td>- Defines a series of request packet classes for a game's network communication, enabling actions such as joining games, sending pings, managing bets, and player interactions like muting or emoting<br>- Each class serializes its data into JSON for server transmission, facilitating various gameplay functionalities and state management.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/network/NetworkPacketProcessor.ts'>NetworkPacketProcessor.ts</a></b></td>
								<td>- Manages the processing of network packets within a multiplayer game environment, handling various game states and player interactions such as starting games, updating tables, and managing player reconnections<br>- It utilizes event-driven communication to update game states across clients efficiently, ensuring game continuity and dynamic interaction handling.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/network/NetworkManager.ts'>NetworkManager.ts</a></b></td>
								<td>- NetworkManager orchestrates real-time network communication for a gaming application, managing WebSocket connections for robust, continuous interaction<br>- It handles connection setup, reconnection logic, message transmission, and session maintenance, including heartbeat for connection liveliness and token refresh for authentication<br>- This component is crucial for maintaining a seamless multiplayer gaming experience.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>components</b></summary>
						<blockquote>
							<details>
								<summary><b>game</b></summary>
								<blockquote>
									<details>
										<summary><b>elements</b></summary>
										<blockquote>
											<table>
											<tr>
												<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/components/game/elements/PlayersController.vue'>PlayersController.vue</a></b></td>
												<td>- Manages the dynamic display and interaction of player components within a multiplayer game environment<br>- It handles player data updates, including statuses, nicknames, and visual representations, and coordinates the animation and management of game cards<br>- The component also listens to and processes game events to maintain real-time game state synchronization.</td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/components/game/elements/Footer.vue'>Footer.vue</a></b></td>
												<td>- Manages the interactive footer component within the game's user interface, incorporating a dynamic action button that responds to game state changes and user interactions<br>- It leverages animation effects to enhance visual feedback and communicates with the network layer to handle game state transitions and betting actions, ensuring synchronization with the game's backend services.</td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/components/game/elements/Game.vue'>Game.vue</a></b></td>
												<td>- Game.vue serves as the central user interface component in the game's architecture, orchestrating gameplay elements and popups such as GameEndPopup, DurakPopup, and WinnerPopup<br>- It integrates major controllers like HandController and TableController, managing lifecycle events and interactions within the game scene, ensuring a cohesive gaming experience.</td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/components/game/elements/Header.vue'>Header.vue</a></b></td>
												<td>- Manages the dynamic display and interaction elements within the game's header, including a balance panel that updates based on game events and player actions<br>- It integrates with the game's event system to handle game state changes and balance updates, and provides a central control for player interactions through the embedded PlayersController component.</td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/components/game/elements/MyPlayerController.vue'>MyPlayerController.vue</a></b></td>
												<td>- Manages the interactive player profile component within a gaming environment, handling real-time updates to player status, image, and game-specific attributes like card counts and timers<br>- It also facilitates user interaction through an emoticon popup for expressing emotions, enhancing player engagement and communication during gameplay.</td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/components/game/elements/CardsManagerRef.ts'>CardsManagerRef.ts</a></b></td>
												<td>- CardsManagerRef serves as a centralized reference manager within the game's architecture, specifically handling the lifecycle and accessibility of the CardsManager component<br>- It enables setting, retrieving, and clearing of the CardsManager instance, ensuring components throughout the application can consistently access and manipulate card-related functionalities as needed.</td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/components/game/elements/CardsManager.vue'>CardsManager.vue</a></b></td>
												<td>- Manages the dynamic rendering and interaction of card elements within the game, including their creation, updates, and removal based on game events<br>- It handles card animations, updates visual indicators like trump suit and transfer icons, and maintains the integrity of the card display through various game phases.</td>
											</tr>
											</table>
											<details>
												<summary><b>Popups</b></summary>
												<blockquote>
													<table>
													<tr>
														<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/components/game/elements/Popups/ChangeBetPopup.vue'>ChangeBetPopup.vue</a></b></td>
														<td>- Manages the interactive betting interface within the game, allowing users to select and modify their bets<br>- It dynamically displays betting options, handles user interactions for bet selection, and communicates changes to the game's network layer<br>- The component also animates visibility based on game events, enhancing user experience during gameplay transitions.</td>
													</tr>
													<tr>
														<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/components/game/elements/Popups/OfferToChangeBetPopup.vue'>OfferToChangeBetPopup.vue</a></b></td>
														<td>- Manages interactive user prompts within the game's interface, specifically handling bet modification requests<br>- It displays a popup allowing players to accept or decline a new bet proposed by an opponent, enhancing real-time decision-making and interaction<br>- The component integrates visual and network functionalities to ensure seamless user experiences and game flow continuity.</td>
													</tr>
													<tr>
														<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/components/game/elements/Popups/DurakPopup.vue'>DurakPopup.vue</a></b></td>
														<td>- DurakPopup.vue manages the display of a popup notification within the game when a player is declared "Durak" (the fool in the card game)<br>- It utilizes Vue.js for reactivity and GSAP for animations, handling visibility and dynamic content loading, such as the game icon, while responding to game events to show or hide the popup effectively.</td>
													</tr>
													<tr>
														<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/components/game/elements/Popups/EmotionPopup.vue'>EmotionPopup.vue</a></b></td>
														<td>- EmotionPopup.vue enables interactive communication in the game by allowing players to express emotions through clickable stickers<br>- It manages visibility, animations, and interaction cooldowns, integrating with the network to send emotion data<br>- The component enhances user engagement by providing a dynamic and responsive interface for emotion selection and display.</td>
													</tr>
													<tr>
														<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/components/game/elements/Popups/WinnerPopup.vue'>WinnerPopup.vue</a></b></td>
														<td>- WinnerPopup.vue serves as a dynamic visual component within the game's architecture, displaying celebratory popups when a player wins<br>- It utilizes animations and event handling to show winning amounts and streaks, enhancing user engagement<br>- The component also manages icon loading and visibility states, ensuring a responsive and interactive user experience.</td>
													</tr>
													<tr>
														<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/components/game/elements/Popups/GameEndPopup.vue'>GameEndPopup.vue</a></b></td>
														<td>- Manages the display and interaction logic for the game's end-of-play popup in a Vue.js component, offering players options to either continue playing or exit the game<br>- It integrates animations for showing and hiding the popup, handles user decisions via network requests, and manages game state transitions based on player input.</td>
													</tr>
													<tr>
														<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/components/game/elements/Popups/KickPopup.vue'>KickPopup.vue</a></b></td>
														<td>- Manages user interactions and visual feedback for game termination scenarios within the gaming platform<br>- Specifically, it handles the display of a modal popup when a player is kicked out due to insufficient balance or expired time, offering a clear exit pathway and ensuring the player understands the reason for the game's interruption.</td>
													</tr>
													<tr>
														<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/components/game/elements/Popups/ReconnectPopup.vue'>ReconnectPopup.vue</a></b></td>
														<td>- Manages the display and behavior of a reconnection popup in a gaming application, utilizing animation effects for visibility transitions<br>- It dynamically loads and caches an icon, responds to network reconnection events, and provides user feedback during reconnection attempts<br>- The component enhances user experience by handling connectivity interruptions gracefully.</td>
													</tr>
													<tr>
														<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/components/game/elements/Popups/TryLeavePopup.vue'>TryLeavePopup.vue</a></b></td>
														<td>- Provides an interactive popup within the game interface, allowing players to confirm their intent to leave the game<br>- It displays potential losses and offers options to either continue playing or exit, enhancing user decision-making<br>- The component integrates animations for visibility transitions and interacts with network services to handle game exit procedures effectively.</td>
													</tr>
													</table>
												</blockquote>
											</details>
											<details>
												<summary><b>Prefabs</b></summary>
												<blockquote>
													<table>
													<tr>
														<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/components/game/elements/Prefabs/Profile.vue'>Profile.vue</a></b></td>
														<td>- Manages the visual representation and interactivity of user profiles within the game, including dynamic display elements such as profile images, status indicators, and timers<br>- It integrates animations for status changes and interactive elements like stickers, enhancing user engagement<br>- The component also handles image loading and caching to optimize performance and user experience.</td>
													</tr>
													<tr>
														<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/components/game/elements/Prefabs/Sticker.vue'>Sticker.vue</a></b></td>
														<td>- Sticker.vue serves as a dynamic visual component within the game's interface, managing the display and animation of emotive stickers based on user interactions<br>- It utilizes Vue.js for reactivity and GSAP for animation sequences, enhancing user engagement by visually representing emotions through animated stickers that respond to game events.</td>
													</tr>
													<tr>
														<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/components/game/elements/Prefabs/Card.vue'>Card.vue</a></b></td>
														<td>- Manages the visual representation and interactivity of playing cards in a digital card game<br>- It handles card animations, drag-and-drop functionality, and dynamic visual updates based on card state changes such as face-up or face-down orientation<br>- The component also integrates with a global event system to communicate game-related actions like attacks or defenses.</td>
													</tr>
													<tr>
														<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/components/game/elements/Prefabs/Player.vue'>Player.vue</a></b></td>
														<td>- Manages the visual and interactive aspects of a player component within a game, displaying different player states such as empty or active<br>- It includes dynamic UI elements like mute functionality and animations based on player status, leveraging network interactions for real-time updates and maintaining responsive design for various display sizes.</td>
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
												<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/components/game/controllers/TableController.ts'>TableController.ts</a></b></td>
												<td>- The `TableController.ts` file within the `src/game/components/game/controllers` directory plays a crucial role in managing the gameplay dynamics on the virtual card table of the game<br>- This controller is primarily responsible for handling the state and interactions of cards during a game, such as updating and caching the cards on the table based on game events.

The file integrates several services and utilities to facilitate these responsibilities:
- **EventService and EventType**: These are used to listen to and handle specific game events related to the card table, ensuring that the table's state is synchronized with game actions.
- **PlayerSettingsStorage and NetworkManager**: These components interact with the network layer, likely dealing with player settings and network-based game actions, which suggests that the game supports multiplayer interactions.
- **RequestPackets (AttackRequest, DefendRequest, CardServerInfo)**: These are used for sending and receiving data packets related to game actions, indicating that the TableController handles attack and defense mechanisms within the game.
- **CardUtils and Validator**: These utilities are used for card-related operations and validations, ensuring that the game logic concerning card movements and rules is adhered to.
- **CardsManagerRef**: This reference suggests a linkage to a manager that handles the visual and interactive aspects of the cards on the table.

Overall, the `TableController` is a central component that orchestrates the flow and rules of the card game, managing both the logic and state of the gameplay on the table, and interacting with the network components to support a multiplayer gaming environment<br>- This file is essential for ensuring that the gameplay is executed correctly and is consistent with the game's rules and player interactions.</td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/components/game/controllers/HandController.ts'>HandController.ts</a></b></td>
												<td>- HandController manages the visual and state aspects of card handling in a game environment<br>- It responds to game events to update, restore, preview, and clear player hand cards, leveraging animations and screen positioning to enhance user interaction<br>- The controller integrates closely with the event and card management systems to maintain gameplay fluidity and responsiveness.</td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/components/game/controllers/DraftController.ts'>DraftController.ts</a></b></td>
												<td>- DraftController manages the lifecycle and interactions of draft cards within the game<br>- It subscribes to game events to handle card movements to the discard pile and the clearing of cards at game end<br>- It utilizes utility classes for card management and validation, ensuring cards are moved, updated, and cleared efficiently during gameplay transitions.</td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/components/game/controllers/DeckController.ts'>DeckController.ts</a></b></td>
												<td>- DeckController manages the dynamic aspects of a card game's deck within the application, handling operations such as updating card counts, setting the trump card, and adjusting card positions on the user interface<br>- It interacts with event-driven services to respond to game state changes and user actions, ensuring the deck's visual and logical representation remains consistent throughout gameplay.</td>
											</tr>
											</table>
										</blockquote>
									</details>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<details>
						<summary><b>utils</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/utils/Validator.ts'>Validator.ts</a></b></td>
								<td>- Validator.ts serves as a core component in the game's architecture, managing gameplay rules and actions<br>- It determines the legality of player moves such as attacking, defending, and transferring cards based on the game's current state, including the trump suit and the completion status of a round<br>- This ensures adherence to the game's strategic and rule-based framework.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/utils/CardUtils.ts'>CardUtils.ts</a></b></td>
								<td>- CardUtils.ts serves as a utility module within the game's architecture, centralizing the definitions and operations related to playing cards<br>- It defines card suits, ranks, and structures for gameplay interactions, such as turns on a table<br>- Additionally, it provides functions for parsing, generating, and retrieving card images and codes, crucial for managing card assets and gameplay mechanics.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/utils/LogInterceptor.ts'>LogInterceptor.ts</a></b></td>
								<td>- LogInterceptor centralizes logging within the game's architecture, capturing and filtering console outputs like logs, errors, and warnings<br>- It enhances debugging by appending stack traces, managing log dispatch, and conditionally sending log data to a specified endpoint based on severity, thereby maintaining a robust monitoring and error-handling mechanism.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/utils/Localizator.ts'>Localizator.ts</a></b></td>
								<td>- Localizator.ts serves as a centralized utility within the game's architecture for managing language translations<br>- It supports dynamic retrieval of localized strings, primarily in Russian, enhancing the game's accessibility and user experience across different language speakers<br>- The class ensures that gameplay elements like buttons and status messages are presented in the user's preferred language.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/game/utils/ImageCache.ts'>ImageCache.ts</a></b></td>
								<td>- ImageCache.ts serves as a centralized image management utility within the game's architecture, efficiently handling the loading, caching, and retrieval of image resources<br>- It ensures images are preloaded and available synchronously, leveraging browser cache capabilities to optimize performance and resource management in the gaming environment.</td>
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
						<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/components/Placeholder.vue'>Placeholder.vue</a></b></td>
						<td>- UniversalPlaceholder, a Vue component within the src/components directory, dynamically displays a loading placeholder<br>- It manages visibility based on the loading state, offering a default animated gradient or a custom class-driven appearance<br>- This component enhances user experience by providing visual feedback during data loading processes across the application.</td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/components/Stencil.vue'>Stencil.vue</a></b></td>
						<td>- Defines a Vue component named "Stencil" that facilitates interactive image cropping within a draggable and resizable circular stencil<br>- It supports dynamic styling based on provided coordinates and transitions, emitting events for movement and resizing actions to enable real-time adjustments and feedback in user interfaces focused on image manipulation.</td>
					</tr>
					</table>
					<details>
						<summary><b>profile-page</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/components/profile-page/ProfilePanel.vue'>ProfilePanel.vue</a></b></td>
								<td>- ProfilePanel.vue serves as a user interface component within the application, primarily responsible for displaying and managing user profile information<br>- It features interactive elements such as an edit button, dynamic loading indicators, and a structured display of user statistics and profile imagery, enhancing user interaction and data presentation on the profile page.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>tournament-page</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/components/tournament-page/PlayerItem.vue'>PlayerItem.vue</a></b></td>
								<td>- PlayerItem.vue serves as a visual component within the tournament system, displaying individual player details on the tournament page<br>- It showcases player avatars, names, ranking positions, prize winnings, and total victories, enhancing user interaction by dynamically updating visual elements based on player performance and image loading status<br>- This component contributes to a seamless and informative user experience in the tournament's interface.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/components/tournament-page/LeaguePanel.vue'>LeaguePanel.vue</a></b></td>
								<td>- LeaguePanel.vue serves as a dynamic user interface component within the tournament system, displaying league-specific information such as rank badges, titles, and a countdown timer to event deadlines<br>- It also shows the prize pool amount, enhancing user engagement by providing real-time updates and visual feedback on tournament progress and status.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>free-game-page</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/components/free-game-page/LobbyItem.vue'>LobbyItem.vue</a></b></td>
								<td>- LobbyItem.vue serves as a visual component within the game's user interface, displaying individual game lobby entries<br>- It dynamically shows the lobby type, player count, and a specific icon based on the lobby's characteristics<br>- This component enhances user interaction by providing essential lobby information and facilitating navigation through different game types and sessions.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/components/free-game-page/FreeGamePanel.vue'>FreeGamePanel.vue</a></b></td>
								<td>- FreeGamePanel.vue serves as a dynamic user interface component within the application, displaying the current status of free games available to users<br>- It features a countdown timer, a progress bar visualizing game restoration, and interactive elements like information popups to enhance user engagement and provide clarity on game availability metrics.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/components/free-game-page/FreePlayButton.vue'>FreePlayButton.vue</a></b></td>
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
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/components/referrals-page/ReferralsPanel.vue'>ReferralsPanel.vue</a></b></td>
								<td>- ReferralsPanel.vue serves as a user interface component within the application, facilitating the display and management of referral-related data<br>- It enables users to view their referral balance, claim payments, and invite others using a provided link, enhancing user engagement through interactive elements and real-time data updates.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/components/referrals-page/FriendItem.vue'>FriendItem.vue</a></b></td>
								<td>- FriendItem.vue serves as a component within the referrals page, displaying individual friend entries with dynamic visual elements<br>- It features animated width adjustments, image loading states, and formatted display of currency values<br>- The component enhances user interaction by providing a visually appealing and responsive layout for each friend's data.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>withdraw-options-page</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/components/withdraw-options-page/CryptoItem.vue'>CryptoItem.vue</a></b></td>
								<td>- CryptoItem.vue serves as a user interface component within the withdrawal options page, displaying cryptocurrency network options<br>- It features a clickable panel that includes a network-specific icon and name, enhancing user interaction by providing a clear, visual representation of each cryptocurrency option available for transactions.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>wallet-page</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/components/wallet-page/TransactionItem.vue'>TransactionItem.vue</a></b></td>
								<td>- Provides a dynamic visual representation of transaction details within a wallet interface, categorizing transactions by type such as deposits, withdrawals, and earnings<br>- It visually distinguishes transaction amounts as positive or negative and displays relevant icons, enhancing user experience by offering intuitive, at-a-glance information about transaction status and details.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>main-page</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/components/main-page/WalletPanel.vue'>WalletPanel.vue</a></b></td>
								<td>- WalletPanel.vue serves as a user interface component within the application, primarily managing the display and interaction with a user's financial balances<br>- It facilitates navigation to detailed wallet, deposit, and withdrawal pages, and dynamically displays current balance and bonus information, enhancing user engagement and operational efficiency in financial management.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/components/main-page/TournamentPanel.vue'>TournamentPanel.vue</a></b></td>
								<td>- TournamentPanel.vue serves as a dynamic user interface component within the application, displaying tournament details such as title, location, and a countdown timer<br>- It enhances user interaction by updating in real-time and providing a clickable interface that redirects to a detailed tournament page, thereby integrating essential tournament information with navigational functionality.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/components/main-page/PlayButton.vue'>PlayButton.vue</a></b></td>
								<td>- Provides an interactive PlayButton component within the main page, enabling users to initiate a game with selected betting options<br>- It dynamically updates bet text based on user preferences stored locally, handles game initiation processes, and manages UI feedback through animations and loading states<br>- Additionally, it integrates settings access through an icon within the button.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/components/main-page/LeaguePanel.vue'>LeaguePanel.vue</a></b></td>
								<td>- Displays a dynamic user interface component for league rankings in a gaming application<br>- It visually represents players' league status, division, and progression through customizable badges, titles, and a color-coded progress bar<br>- Interaction is enabled through clickable elements that trigger detailed league information, enhancing user engagement and providing contextual game data efficiently.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>notification-layout</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/components/notification-layout/NotificationItem.vue'>NotificationItem.vue</a></b></td>
								<td>- Manages interactive notifications within the application, enabling users to engage with various types of alerts through touch gestures<br>- It supports dynamic visual feedback, such as swiping to dismiss, and integrates multimedia elements like icons and stickers to enhance user interaction<br>- The component also handles animation and style transitions to provide a smooth user experience.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>referrals-details-page</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/components/referrals-details-page/ReferralsDetailsPanel.vue'>ReferralsDetailsPanel.vue</a></b></td>
								<td>- ReferralsDetailsPanel.vue serves as a visual representation component within the project, displaying a weekly statistics chart<br>- It dynamically renders a bar chart based on provided data, showcasing daily values with animated height adjustments<br>- The component also handles data loading states, enhancing user interaction by visually indicating data processing phases.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>deposit-page</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/components/deposit-page/ExpandableItem.vue'>ExpandableItem.vue</a></b></td>
								<td>- ExpandableItem.vue serves as a dynamic component within the deposit-page directory, enabling users to interact with collapsible panels that display cryptocurrency transaction details<br>- It facilitates the viewing of wallet addresses, transaction specifics like rates and fees, and provides a user-friendly mechanism for copying wallet addresses, enhancing the overall user experience in managing crypto transactions.</td>
							</tr>
							</table>
						</blockquote>
					</details>
				</blockquote>
			</details>
			<details>
				<summary><b>views</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/views/Test.vue'>Test.vue</a></b></td>
						<td>- Displays the current navigation route within a Vue.js application, utilizing Vue Router for route management<br>- The component, located at src/views/Test.vue, dynamically shows the route path on the user interface and logs it upon component mounting, aiding in debugging and route tracking within the application's architecture.</td>
					</tr>
					</table>
					<details>
						<summary><b>pages</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/views/pages/MainPage.vue'>MainPage.vue</a></b></td>
								<td>- Serves as the main user interface for displaying user-specific data in a gaming application, integrating components like LeaguePanel, TournamentPanel, WalletPanel, and PlayButton<br>- It fetches and caches user data from the server, updates UI components dynamically, and handles user interactions to enhance the gaming experience.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/views/pages/TournamentPage.vue'>TournamentPage.vue</a></b></td>
								<td>- TournamentPage.vue serves as the user interface for displaying tournament details and player rankings within a gaming platform<br>- It dynamically presents league information, a list of top players, and individual player details, enhancing user engagement by allowing interaction with tournament data and facilitating navigation through player rankings.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/views/pages/DepositPage.vue'>DepositPage.vue</a></b></td>
								<td>- Provides a user interface for cryptocurrency deposits within a Vue.js application, enabling users to view and interact with deposit details such as wallet addresses, minimum and recommended deposit amounts, and network fees<br>- It also includes functionality to copy the wallet address and handle data loading states.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/views/pages/WithdrawOptionsPage.vue'>WithdrawOptionsPage.vue</a></b></td>
								<td>- WithdrawOptionsPage.vue serves as a user interface within the application, enabling users to select a cryptocurrency network for withdrawal purposes<br>- It integrates a component for displaying crypto options and utilizes routing for navigation<br>- The page also records page visits through an API call upon component mounting, enhancing user interaction tracking.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/views/pages/FreeGamePage.vue'>FreeGamePage.vue</a></b></td>
								<td>- Provides a user interface for a free gaming experience, featuring a dynamic display of available game sessions and player lobbies<br>- It integrates components like FreeGamePanel, LobbyItem, and FreePlayButton to manage game sessions, display lobby details, and facilitate user interaction with the game's free play options, enhancing the overall user engagement and navigation within the gaming platform.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/views/pages/ReferralsDetailsPage.vue'>ReferralsDetailsPage.vue</a></b></td>
								<td>- ReferralsDetailsPage.vue serves as a user interface component within the application, displaying detailed referral transaction histories and graphical data analytics<br>- It fetches and visualizes transaction data and trends related to user referrals, enhancing the understanding of referral impacts through dynamic data presentation and detailed transaction listings.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/views/pages/EditProfilePage.vue'>EditProfilePage.vue</a></b></td>
								<td>- Enables users to edit their profile by updating their name and profile picture on a Vue-based web application<br>- It incorporates image cropping functionality and real-time validation with timers to manage edit availability<br>- Changes are saved via API calls, and user feedback is provided through notifications upon successful or failed updates.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/views/pages/ProfilePage.vue'>ProfilePage.vue</a></b></td>
								<td>- ProfilePage.vue serves as a user interface component within the Vue.js application, displaying user profile details and statistics<br>- It integrates dynamic data fetching, caching for offline access, and navigation to a wallet page<br>- The component enhances user interaction by updating profile information and facilitating navigation through the application's features.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/views/pages/DepositOptionsPage.vue'>DepositOptionsPage.vue</a></b></td>
								<td>- DepositOptionsPage.vue serves as a user interface within the application, enabling users to select a cryptocurrency network for deposit purposes<br>- It integrates components for displaying crypto options and utilizes navigation and API services to enhance user interaction and track page visits, respectively.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/views/pages/ReferralsPage.vue'>ReferralsPage.vue</a></b></td>
								<td>- Manages the display and interaction of referral data on a dedicated page within a Vue.js application<br>- It fetches, caches, and updates referral information, including balances and top referrer details, and dynamically adjusts UI components based on the retrieved data to enhance user engagement and provide real-time updates.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/views/pages/WithdrawPage.vue'>WithdrawPage.vue</a></b></td>
								<td>- Manages cryptocurrency withdrawal interactions for users, enabling them to specify wallet addresses and withdrawal amounts within defined limits<br>- It dynamically updates transaction details based on user input and network conditions, ensuring users can execute secure and informed transactions<br>- Additionally, it handles user input validations and displays relevant notifications for errors or updates.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/views/pages/WalletPage.vue'>WalletPage.vue</a></b></td>
								<td>- WalletPage.vue serves as the user interface for displaying a user's wallet details, including balance, bonus, and a transaction history<br>- It integrates components for visualizing wallet status and individual transactions, and interacts with backend services to fetch and display financial data upon user visit.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>popups</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/views/popups/WithdrawConfirmationPopup.vue'>WithdrawConfirmationPopup.vue</a></b></td>
								<td>- Manages the user interaction for confirming cryptocurrency withdrawals, displaying transaction details such as wallet address, withdrawal amount, and network fees<br>- It integrates biometric authentication for security and communicates with backend services to execute and verify the transactions.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/views/popups/FreeGameSettingsPopup.vue'>FreeGameSettingsPopup.vue</a></b></td>
								<td>- Manages the user interface and functionality for configuring settings in a free game mode within the application<br>- It allows users to select player counts and game rules, persisting these preferences locally<br>- The component also communicates with a backend service to log visits and interacts with other components via event emissions to manage visibility.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/views/popups/LeagueInformationPopup.vue'>LeagueInformationPopup.vue</a></b></td>
								<td>- Displays a user interface for a league information popup in a gaming application, providing visual and textual information about different competitive leagues<br>- It allows users to understand the benefits of advancing leagues and tracks their current league status<br>- The component also handles user interactions to close the popup and logs visits for analytics purposes.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/views/popups/ReferralsInformationPopup.vue'>ReferralsInformationPopup.vue</a></b></td>
								<td>- Provides a user interface for displaying information about the referral system in a popup format<br>- It explains the commission structure and potential earnings from referred players, enhancing user engagement and understanding<br>- Additionally, it includes functionality to track popup visits and allows users to close the popup, ensuring a smooth user interaction within the application's ecosystem.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/views/popups/TournamentInformationPopup.vue'>TournamentInformationPopup.vue</a></b></td>
								<td>- Provides a user interface for displaying tournament information in a popup format within the application<br>- It informs users about weekly tournaments, potential rewards, and the impact of player rankings on rewards<br>- Additionally, it tracks user interaction with the popup for analytics and allows users to close the popup through a button click.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/views/popups/BonusBalanceInformationPopup.vue'>BonusBalanceInformationPopup.vue</a></b></td>
								<td>- Provides a user interface for displaying bonus balance information in a popup format within the application<br>- It educates users about the nature of bonus balances, their usage, and restrictions<br>- The component also tracks user interaction by logging visits to this popup and offers a mechanism to close the popup through a button interaction.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/views/popups/OnBoardingPopup.vue'>OnBoardingPopup.vue</a></b></td>
								<td>- OnBoardingPopup.vue serves as an interactive tutorial for new users, guiding them through a series of informative slides about earning opportunities and features within the application<br>- It enhances user engagement by utilizing dynamic visuals and animations, and integrates with backend services to track user progress and interactions during the onboarding process.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/views/popups/TournamentWinPopup.vue'>TournamentWinPopup.vue</a></b></td>
								<td>- Displays a user interface for a tournament victory popup in a gaming application, presenting the player's rank, placement, total wins, gap from the previous position, and monetary reward<br>- It dynamically loads and displays league-specific imagery and provides functionality to close the popup, effectively communicating tournament results and rewards to the player.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/views/popups/FreeGamePopup.vue'>FreeGamePopup.vue</a></b></td>
								<td>- FreeGamePopup.vue serves as a user interface component within the application, presenting a popup that encourages gameplay by detailing the free game mechanics and energy restoration system<br>- It also includes functionality to track user interaction with the popup and provides a button to close the popup, enhancing user engagement and experience.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/views/popups/GameSettingsPopup.vue'>GameSettingsPopup.vue</a></b></td>
								<td>- GameSettingsPopup.vue serves as the user interface for configuring game settings within the application<br>- It allows players to select the number of participants, set betting amounts, and choose game rules<br>- Changes are saved locally and can be dynamically updated based on available options fetched from an external service.</td>
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
						<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/services/ApiService.ts'>ApiService.ts</a></b></td>
						<td>- ApiService.ts serves as a centralized communication hub for interacting with a remote API, managing authentication, token storage, and data retrieval across various application screens<br>- It encapsulates the logic for making HTTP requests, handling responses, and maintaining session continuity through token refresh mechanisms, crucial for the seamless operation of the client-side application.</td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>router</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/VyacheslavPridchin/ton-durak-frontend/blob/master/src/router/index.ts'>index.ts</a></b></td>
						<td>- Establishes the navigation framework for a Vue.js application, defining routes for various user interfaces including main, profile, tournament, wallet, and game pages<br>- It configures the application's routing with a history mode based on the project's base URL and sets a default redirection to the main page.</td>
					</tr>
					</table>
				</blockquote>
			</details>
		</blockquote>
	</details>
</details>

