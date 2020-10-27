import React from 'react';
import './styles.css';

export default class CardCmp extends React.Component {

    constructor(props){
        super(props);
        // console.log(this.props);
        this.imgStyles = {
            backgroundImage: 'url(' + this.props.imageUrl + ')'
        };
    }

    render(){
        return (
            <div className="card card-custom mx-2 mb-3 col">
               <div className="card-img" style={this.imgStyles}></div>
               <div className="card-body">
                   <div>
                       <strong>Name:</strong> {this.props.name}
                   </div>
                   <div className="truncate">
                       <strong>Text:</strong> {this.props.text}
                   </div>
                   <div>
                       <strong>Set Name:</strong> {this.props.setName}
                   </div>
                   <div>
                       <strong>Type:</strong> {this.props.type}
                   </div>         
                </div>
            </div>
        );
    }

  }