This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Prerequesites
1. node v10.22.1
2. yarn 1.22.5

## How to install dependecies?
### `yarn`

## How to run react app?
### `yarn start`

# Project Notes

## 1. Code Structure
Seperation of concerns, reusability & Encapsulization are most important Software Engineering principles. This project is divided in apis, Containers & Components.
- *.api.js are the files that will make API calls for CRUD & other operations
- containers: aggregators of components, will communicate with api files to pull data
- components: presentation layer (containers must pass data to show the UX visuals), each component/container folder must have encapsulated the relevant css files

## 2. External libraries/components used
- lodash -> to use debounce, to improve performance
- InfiniteScroll component -> to allow load on scroll for cards
- Bootstrap -> for grid layout

## 3. Implementation Details
- CardGrid container communicates with cards.api.js to retrieve cards info & uses Cards component to render them
- CardGrid container uses InfiniteScroll component to detect if user is near the end of the page, if so then another request is made to retrieve data until no more data is found
- Search bar allows users to filter by name. CardGrid container uses `debounce` to delay making more requests, improving performance of search

## 4. Future Implementation/Improvements
A. Testing
- Considering time limitation & react is something new for me, this project doesn't have unit/automated compoonent tests
- However, if I had more time, I would like to test search bar & cards rendering (what if no cards, what if too many cards, is new request made when user is closed to the end of the window etc.) components/containers

B. Improving InfiniteScroll for infinte cards
- Currently if there is infinite # of cards, then we may see a performance issue as all cards are rendered in DOM. Implementing, frontend pagination (keeping X # of cards on frontend at a time) would solve this problem

