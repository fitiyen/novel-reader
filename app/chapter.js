import React from 'react';
import Axios from 'axios';

export default class Chapter extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            content: ""
        }
    }

    goChapter(idx){
        var chapter = this.getChapterByContents(idx);
        var url = chapter.contentUrl;
        Axios.get('/chapter', {
            params: {
                url: url
            }
        }).then(function(res){
            this.setState({chapter: res.data.chapter});
            this.showNovelContents(false);
        }) 
    }

    goTo(prev){
        var currChapter = this.state.currChapter;
        var contents = this.props.contents;
        var idx = this.props.index + (prev ? -1: 1);
        this.goChapter(idx);


    }

    goToPrev(){
        goTo(true);
    }

    goToNext(){
        goTo(false);
    }

    render(){
        return <pre style={{whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontSize: '20px', textIndent: '30px', lineHeight: '40px', margin: '0 auto'}}>
                    {this.state.chapter}
                </pre>
                <div>
                    <button onClick={this.goToPrev}>前一章</button>
                    <button onClick={this.onBack}>回目錄</button>
                    <button onClick={this.goToNext}>下一章</button>
                </div>
    }
}