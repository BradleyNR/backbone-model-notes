import React, { Component } from 'react';
import './App.css';

var $ = window.$ = require('jquery');
var Backbone = require('backbone');


// SETTING HEADERS BEFORE ANY AJAX REQUEST
$.ajaxSetup({
  beforeSend: function(xhr){
    xhr.setRequestHeader('X-Parse-Application-Id', 'carson');
    xhr.setRequestHeader('X-Parse-REST-API-Key', 'naturarogue')
  }
});


// BACKBONE MODEL = creating what a social button should look like
// idAttribuite is what the model should use as our ID. objectId comes from parse server.
// ternary in label method
var SocialButton = Backbone.Model.extend({
  idAttribute: 'objectId',
  // Below is optional if you have models in a collection
  urlRoot: 'https://naturals-test-parse-server.herokuapp.com/classes/SocialButton',
  defaults: {
    'title': 'Facebook',
    'likeCount': 0
  },
  label: function(){
    return this.get('likeCount') === 1 ? 'Like' : 'Likes';
  },
  // custom save server
  save: function(key, val, options){
    // removing attributes for ParseSErver
    delete  this.attributes.createdAt;
    delete  this.attributes.updatedAt;

    // Make sure we still do our save method
    return Backbone.Model.prototype.save.apply(this, arguments);
  }
});



var SocialButtonCollection = Backbone.Collection.extend({
  model: SocialButton,
  url: 'https://naturals-test-parse-server.herokuapp.com/classes/SocialButton',
  parse: function(data){
    return data.results;
  }
});

console.log(SocialButtonCollection);

class App extends Component {
  constructor(props){
    super(props);

    // fetch specific button from server by ID
    let button = new SocialButton({objectId: 'GD3XAM3ovx'});
    // calling fetch, it needs a function with mode, response, options
    button.fetch({success: (model, response, options) => {
      this.setState({button: button, loading: false});
    }});

    console.log(SocialButtonCollection);

    let socialButtonCollection = new SocialButtonCollection();

    this.state = {
      socialButtonCollection: socialButtonCollection,
      button: button,
      loading: true
    }
  }

  // GETTING COLLECTION FROM SERVER
  componentDidMount(){
    let SocialButtonCollection = this.state.socialButtonCollection;
    SocialButtonCollection.fetch().then(() => {
      this.setState({socialButtonCollection: SocialButtonCollection});
    });
  }


  handleLike = (e) => {
    let button = this.state.button;
    let currentLikes = button.get('likeCount');
    button.set('likeCount', currentLikes + 1);
    button.save();
    this.setState({button: button});
  }

  render() {
    let button = this.state.button;


    return (
      <div className="App">
        {this.state.loading ? 'Loading...' :
        <button onClick={this.handleLike}>{button.get('title')} {button.get('likeCount')} {button.label()}</button>
        }

        <ul>

          {this.state.socialButtonCollection.map((model) => {
            return (
              <li key={model.get('id')}>
              <button onClick={this.handleLike}>{model.get('title')} {model.get('likeCount')} {model.label()}</button>
              </li>
            )
          })}

        </ul>
      </div>
    );
  }
}

export default App;

// var.get('thingtoget')  --> Gets
// var.set('thingtoset', newValue)

// doing save the first time, post request
// doing save later does put request with objectId
// _________________
// var.save()
