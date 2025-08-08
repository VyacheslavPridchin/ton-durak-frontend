# TonDurak Frontend - Technical Documentation

## 📋 Project Overview

TonDurak Frontend is a Vue.js 3 application implementing the client-side of a multiplayer card game "Durak" with TON blockchain integration. The application is developed as a Telegram Web App with real-time support, cryptocurrency transactions, and tournament system.

## 🏗️ Application Architecture

### Core Structure
The project follows a modular architecture with clear separation of concerns:

- **Main Entry Point**: Application initialization with Telegram Web App integration
- **Router Layer**: Client-side routing with lazy-loaded components
- **Service Layer**: API communication and business logic
- **Component Layer**: Reusable UI components organized by feature
- **Game Layer**: Real-time game logic and WebSocket communication
- **Layout System**: Page layouts and navigation structure

### Directory Organization
The source code is organized into logical modules:
- `src/main.ts` - Application entry point with authentication flow
- `src/App.vue` - Root component with layout management
- `src/router/` - Vue Router configuration with route guards
- `src/services/` - API services and external integrations
- `src/components/` - Reusable UI components by feature
- `src/views/` - Page-level components
- `src/layouts/` - Layout components for different page types
- `src/in-game/` - Game-specific logic and components
- `src/assets/` - Static resources and global styles

## 🔧 Technology Stack

### Frontend Framework
- **Vue 3.5.13** - Progressive JavaScript framework with Composition API
- **TypeScript 5.7.3** - Static type checking and enhanced developer experience
- **Vue Router 4.5.0** - Official router for Vue.js with navigation guards

### Build System
- **Vite 6.1.0** - Fast build tool and development server
- **Vue TSC 2.2.2** - TypeScript compiler for Vue components
- **Sass Embedded 1.86.0** - CSS preprocessor with advanced features

### Network Libraries
- **Axios 1.8.3** - Promise-based HTTP client for REST API communication
- **WebSocket** - Native WebSocket support for real-time game communication
- **Mitt 3.0.1** - Tiny event emitter for internal application events

### UI/UX Libraries
- **GSAP 3.12.7** - Professional animation library for smooth transitions
- **Swiper 11.2.4** - Mobile touch slider component
- **Vue Advanced Cropper 2.8.9** - Image cropping and processing

## 🚀 Application Initialization

### Startup Process
The application follows a specific initialization sequence:

1. **Theme Detection**: Automatically detects and applies Telegram Web App theme
2. **Telegram Integration**: Configures Web App settings and permissions
3. **Authentication**: Validates user through Telegram Web App initData
4. **Token Management**: Handles JWT tokens with automatic refresh
5. **Data Caching**: Stores user data and preferences locally
6. **Router Setup**: Initializes client-side routing with guards
7. **Event System**: Sets up internal event communication
8. **Component Mounting**: Renders the application interface

### Telegram Web App Configuration
The application integrates deeply with Telegram Web App API:
- Disables vertical swipes for better game experience
- Enables closing confirmation to prevent accidental exits
- Expands to fullscreen on mobile platforms
- Locks orientation to portrait mode
- Handles back button navigation intelligently
- Synchronizes theme with Telegram settings

## 🌐 Network Architecture

### REST API Communication
The application uses a centralized API service for all backend communication:

**Authentication Flow**:
- Receives Telegram Web App initData
- Validates data integrity on server
- Returns JWT access and refresh tokens
- Implements automatic token refresh mechanism

**API Endpoints**:
- User authentication and profile management
- Game lobby and matchmaking
- Financial transactions and wallet operations
- Tournament and league management
- Referral system and rewards

**Error Handling**:
- Automatic retry mechanism for failed requests
- Token refresh on authentication errors
- Graceful degradation for network issues
- User-friendly error messages

### WebSocket Real-time Communication
The game uses WebSocket for real-time gameplay:

**Connection Management**:
- Automatic connection establishment
- Heartbeat mechanism for connection health
- Exponential backoff reconnection strategy
- Connection state monitoring and recovery

**Message Protocol**:
- Binary message format for efficiency
- Structured packet system for different game events
- Message validation and error handling
- Event-driven architecture for game state updates

**Game Events**:
- Player actions and game state changes
- Card movements and animations
- Chat and emotion system
- Tournament updates and notifications

### Event System Architecture
Internal event system for component communication:

**Event Types**:
- Game state management events
- UI interaction events
- Network communication events
- Animation and transition events

**Event Flow**:
- Centralized event emitter
- Typed event payloads
- Event subscription management
- Memory leak prevention

## 🎮 Game Architecture

### Game Controllers
The game logic is organized into specialized controllers:

**Deck Controller**:
- Manages card deck state and visualization
- Handles trump card display and positioning
- Synchronizes deck size with server state
- Controls card animation sequences

**Hand Controller**:
- Manages player's hand cards
- Handles card selection and validation
- Controls card positioning and animations
- Manages available card highlighting

**Table Controller**:
- Manages cards on the game table
- Handles attack and defense card placement
- Controls turn-based card positioning
- Manages table state synchronization

**Player Controller**:
- Manages player states and information
- Handles player actions and timers
- Controls player UI elements
- Manages player statistics

### Card System
Comprehensive card management system:

**Card Types**:
- Standard playing cards (2-Ace, 4 suits)
- Special cards for game mechanics
- Back cards for deck visualization
- Trump card with special display

**Card Operations**:
- Card creation and destruction
- Position and rotation management
- Animation and transition control
- Image loading and caching

**Card Skins**:
- Multiple visual themes
- Dynamic skin switching
- Custom card designs
- Performance-optimized rendering

### Game State Management
Real-time game state synchronization:

**State Components**:
- Player positions and information
- Card distributions and movements
- Game phase and turn management
- Timer and timeout handling

**State Synchronization**:
- Server-authoritative game state
- Client-side prediction and reconciliation
- Smooth state transitions
- Conflict resolution mechanisms

## 📱 Component Architecture

### Layout System
Flexible layout system for different page types:

**Fullscreen Layout**:
- Optimized for game interface
- Minimal UI elements
- Focus on gameplay experience
- Responsive design for all screen sizes

**Slider Layout**:
- Side navigation for main pages
- Smooth transition animations
- Consistent navigation experience
- Mobile-optimized interactions

**Popup Layout**:
- Modal dialogs and overlays
- Backdrop and focus management
- Animation and transition effects
- Accessibility considerations

### Component Organization
Components are organized by feature and responsibility:

**Page Components**:
- Main dashboard and navigation
- Profile and settings management
- Tournament and league interfaces
- Financial and wallet operations

**Game Components**:
- Card rendering and interaction
- Player information display
- Game controls and actions
- Chat and communication

**UI Components**:
- Buttons and form elements
- Navigation and menu items
- Loading and error states
- Notification and feedback

### Component Communication
Efficient component interaction patterns:

**Props and Events**:
- Parent-child communication
- Event emission and handling
- Data flow management
- Component reusability

**Event Bus**:
- Cross-component communication
- Global state updates
- Application-wide events
- Decoupled architecture

## 🎨 Styling System

### CSS Architecture
Modern CSS architecture with best practices:

**SCSS Structure**:
- Modular SCSS files
- Variable and mixin system
- Component-scoped styles
- Global utility classes

**Design System**:
- Consistent color palette
- Typography scale
- Spacing and layout grid
- Component design tokens

**Theme System**:
- Dark and light theme support
- CSS custom properties
- Dynamic theme switching
- Accessibility considerations

### Animation System
Comprehensive animation framework:

**GSAP Integration**:
- High-performance animations
- Timeline-based sequences
- Easing and interpolation
- Hardware acceleration

**Animation Types**:
- Card movement and transitions
- UI element animations
- Loading and feedback animations
- Game-specific effects

**Performance Optimization**:
- GPU-accelerated animations
- Animation batching
- Memory management
- Frame rate optimization

## 🔐 Authentication System

### Telegram Web App Integration
Seamless integration with Telegram platform:

**Authentication Flow**:
- Secure data validation
- User identity verification
- Session management
- Privacy protection

**Data Handling**:
- Encrypted data transmission
- Local storage security
- Token management
- Session persistence

### Token Management
Robust token handling system:

**JWT Implementation**:
- Access token management
- Refresh token rotation
- Automatic token renewal
- Secure token storage

**Security Features**:
- Token expiration handling
- Secure storage mechanisms
- Network security
- Session validation

## 📊 State Management

### Application State
Comprehensive state management strategy:

**State Types**:
- User data and preferences
- Game state and progress
- UI state and interactions
- Network connection state

**State Persistence**:
- Local storage for user data
- Session storage for temporary data
- Cache management
- Data synchronization

### Caching Strategy
Intelligent caching system:

**Image Caching**:
- Card image preloading
- Progressive image loading
- Cache invalidation
- Memory management

**Data Caching**:
- API response caching
- User preference caching
- Game state caching
- Performance optimization

## 🚀 Build and Deployment

### Development Environment
Optimized development workflow:

**Development Server**:
- Hot module replacement
- Fast refresh capabilities
- Source map generation
- Error overlay

**Type Checking**:
- TypeScript compilation
- Type validation
- Error reporting
- Development feedback

### Production Build
Optimized production deployment:

**Build Process**:
- Code minification
- Asset optimization
- Tree shaking
- Bundle splitting

**Performance Optimization**:
- Lazy loading
- Code splitting
- Asset compression
- Cache optimization

### Configuration Management
Flexible configuration system:

**Environment Variables**:
- API endpoint configuration
- Feature flags
- Debug settings
- Environment-specific settings

**Build Configuration**:
- Vite configuration
- TypeScript settings
- Asset handling
- Output optimization

## 📱 Telegram Web App Integration

### Platform Features
Comprehensive Telegram Web App integration:

**UI Integration**:
- Native Telegram styling
- Platform-specific behaviors
- Responsive design
- Accessibility support

**Navigation Handling**:
- Back button management
- Deep linking support
- Navigation state preservation
- Platform-specific navigation

**Platform APIs**:
- Web App API utilization
- Platform feature detection
- Fallback mechanisms
- Cross-platform compatibility

### User Experience
Optimized user experience for Telegram:

**Mobile Optimization**:
- Touch-friendly interfaces
- Gesture support
- Orientation handling
- Performance optimization

**Accessibility**:
- Screen reader support
- Keyboard navigation
- High contrast support
- Focus management

## 🎯 Performance Optimization

### Loading Performance
Optimized application loading:

**Initial Load**:
- Critical path optimization
- Resource prioritization
- Progressive loading
- Performance monitoring

**Runtime Performance**:
- Memory management
- Garbage collection optimization
- Event handling efficiency
- Animation performance

### Network Optimization
Efficient network communication:

**API Optimization**:
- Request batching
- Response caching
- Compression
- Connection pooling

**WebSocket Optimization**:
- Message compression
- Connection management
- Reconnection strategies
- Bandwidth optimization

## 🔍 Development and Debugging

### Development Tools
Comprehensive development tooling:

**Vue DevTools**:
- Component inspection
- State debugging
- Performance profiling
- Timeline analysis

**TypeScript Support**:
- Type checking
- IntelliSense
- Refactoring tools
- Error detection

**Debugging Capabilities**:
- Source map support
- Console logging
- Error tracking
- Performance monitoring