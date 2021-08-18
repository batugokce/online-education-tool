import React, { Component } from 'react';

import LandingPage from './LandingPage';
import axios from "axios";
import authHeader from "../../service/authHeader";

export class ArticleScrollPanel extends Component {

    constructor() {
        super();
    }

  render() {
    return (
      <div>
        <LandingPage article={this.props.article} title={this.props.title} articleId={this.props.articleId}  />
      </div>
    );
  }
}

