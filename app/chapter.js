import React from 'react';

export default class Chapter extends React.Component{
    constructor(props){
        super(props);//chapter
        this.goToContents = this.goToContents.bind(this);
        this.goToPrev = this.goToPrev.bind(this);
        this.goToNext = this.goToNext.bind(this);
    }

    goToContents(){
        this.props.moveTo(0);
    }

    goToPrev(){
        this.props.moveTo(-1);
    }

    goToNext(){
        this.props.moveTo(1);
    }

    render(){
        //
        var content = this.props.chapter.content;
        if (content){
            content = content.replace(/\n/g, '\n　　').trim();
        }
        
        return <div>
                <pre style={{whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontSize: '16px', lineHeight: '28px', margin: '0 auto'}}>
                {content}
                </pre>
            <div>
                <button onClick={this.goToPrev}>前一章</button>
                <button onClick={this.goToContents}>回目錄</button>
                <button onClick={this.goToNext}>下一章</button>
            </div>
        </div>
    }
}