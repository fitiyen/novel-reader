import React from 'react';

export default class Contents extends React.Component{
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(evt){
        evt.preventDefault();

    }

    render(){
        return <li style={{padding: '7px 0 0 2px', display:'inline', float:'left', width:'280px', overflow: 'hidden' , whiteSpace: 'nowrap' }} 
            key={index}> 
                <a href={fullHost+content.href} onclick={that.onClickChapter} >{content.title}</a>
        </li>;
    }
}