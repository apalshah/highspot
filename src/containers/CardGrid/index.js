import React, { useRef } from 'react';
import CardCmp from '../../components/Card/index';
import CardsAPI from '../../apis/cards.api';
import CircleLoader from "react-spinners/CircleLoader";
import InfiniteScroll from 'react-infinite-scroll-component';
import { css } from "@emotion/core";
import debounce from 'lodash.debounce';
import './styles.css';

//constant values that won't change
const PAGESIZE = 20;
const SEARCH_DEBOUNCE_DELAY = 1000;

export default class CardGridCtn extends React.Component {

    constructor(props){
        super(props);
        /* 
        cards: all cards users will see
        isLoaded: to control show/hide of a loading spinner
        hasMore: flag used by InfiniteScroll component to see if there is more data to load 
        page: backend pagination page #
        keywords: keywords used to search cards (for now by name)
        */
        this.state = {
            cards : [],
            isLoaded: false,
            hasMore: true,
            page: 1,
            keywords: ""
        };
        //cards api to communicate with /cards api
        this.cardsAPI = new CardsAPI();
        this.spinnerOverride = css`
            display: block;
            margin: 0 auto;
            border-color: red;
            `;
        //function to GET cards
        this.fetchData = this.fetchData.bind(this);
        this.handleKeywordsChange = this.handleKeywordsChange.bind(this);
    }

    //as users type in the search bar this function gets called
    //it uses debounce so we don't end up making many requests as user types
    handleKeywordsChange(event){
      event.persist();
      const { value: nextValue } = event.target;
      this.setState({
          keywords: nextValue
      });
      // console.log("nextValue:", nextValue);
      if(this.debouncedSearch === undefined){
        this.debouncedSearch = debounce(() => {
          console.log(this.state.keywords);
          this.fetchData(true);
        }, SEARCH_DEBOUNCE_DELAY);
      }
      this.debouncedSearch();
    }

    fetchData(resetPagination){
      //resetPagination is a flag if TRUE then it's a fresh new pulling of cards
      if(resetPagination){
        this.setState({
          hasMore: true,
          page: 1,
          cards: []
        });
      }
      //return if all `cards` are loaded
      if(!this.state.hasMore){
        console.warn("Nothing more to fetch");
        return;
      }
      //setup params for the GET requests
      let params = {
        page: this.state.page,
        pageSize: PAGESIZE
      };
      //if user typed something in the search bar, then use it in GET request
      if(this.state.keywords.length !== 0){
        let formattedKeywords = "";
        //there are two options supported for keywords search -> &/|, for now the search is done for `name` field with `|` operator
        //e.g. user types `Raised Dead`, the search would done for `name` field for words `Raised` or `Dead`
        if (/\s/.test(this.state.keywords)) {
          this.state.keywords.split(" ").forEach((keyword, i) => {
            formattedKeywords += keyword + "|";
          });
          formattedKeywords.slice(0, -1) 
        }else{
          formattedKeywords = this.state.keywords;
        }
        console.log(formattedKeywords);
        params.name = formattedKeywords;
      }
      // console.log(params);
      //GET request to /cards endpoint
      this.cardsAPI.get(params)
        .then(res => res.json())
        .then(
          (result) => {
            // console.log(result);
            //if no more cards then set `hasMore` to false
            if(result.cards.length === 0){
              // console.log("hasMore done");
              this.setState({
                 isLoaded: true,
                 hasMore: false
              });
            }
            //if API has more data then change state of `page` & concatenate new cards with existing cards
            else{
              this.setState({
                isLoaded: true,
                cards: this.state.cards.concat(result.cards),
                page: this.state.page+1
              });
            }
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            this.setState({
              // isLoaded: true,
              error
            });
          }
        )
    }

    componentDidMount() {
      //call fetchData when component mounts
      this.fetchData(false);
    }

    renderCard(card, key){
        // console.log("card",card);
        return (
                this.state.isLoaded && <CardCmp key={card.id} 
                                                    name={card.name}
                                                    imageUrl={card.imageUrl}
                                                    setName={card.set.name}
                                                    type={card.type}
                                                    text={card.text}
                                        />
            
        );
    }


    render() {
      return (
        <div className="card-grid container">
              {/* Search Bar to search cards by `name` */}
              <div className="search-bar input-group col-md-12 col-sm-12 col-lg-12">
                <input className="form-control py-2" 
                        type="search" 
                        placeholder="Search by Name"
                        value={this.state.keywords} onChange={this.handleKeywordsChange}/>
              </div>

              {/* InfinteScroll component helps scroll & load cards until there are no more cards */}
              <InfiniteScroll
                dataLength={this.state.cards.length} //This is important field to render the next data
                next={this.fetchData}
                hasMore={this.state.hasMore}
                loader={!this.state.isLoaded && <CircleLoader
                        css={this.spinnerOverride}
                        size={150}
                        color={"#123abc"}
                        loading={this.state.loading}
                        />}   
                endMessage={
                  <p style={{ textAlign: 'center' }}>
                    { this.state.cards.length !== 0 && <b>Yay! You have seen it all</b> }
                    { this.state.cards.length === 0 && <b>Sorry! No matching cards found.</b> }
                  </p>
                }
              >
                <div className="row mt-5 justify-content-center">
                  {/* Render cards as user scrolls */}
                  {this.state.isLoaded && this.state.cards.map((card, i) => this.renderCard(card))}
                </div>
              </InfiniteScroll>
        </div>
        
      );
    }
  }