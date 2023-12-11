import React, { Component } from 'react';

class NewsArticle extends Component {
  render() {
    const { article } = this.props;

    return (
      <div className="card mt-3">
        <img src={article.urlToImage} className="card-img-top" alt="News Image" />
        <div className="card-body">
          <h5 className="card-title">{article.title}</h5>
          <p className="card-text">{article.description}</p>
          <a href={article.url} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
            Read More
          </a>
          <p className="card-text mt-2">
            <small className="text-muted">Published at: {new Date(article.publishedAt).toLocaleString()}</small>
          </p>
        </div>
      </div>
    );
  }
}

export default NewsArticle;
