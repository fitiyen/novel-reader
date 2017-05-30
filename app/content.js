import React from 'react';

export default class Content extends React.Component{
    constructor(props){
        super(props);//activeNovel, href, title, idx
        this.onClickChapter = this.onClickChapter.bind(this);
    }

    onClickChapter(evt){
        evt.preventDefault();
        //var url = evt.target.href;
        var url = evt.target.dataset.link;
        //本來想直接用 key，但它是特殊屬性，不能從 this.props 取得。https://facebook.github.io/react/warnings/special-props.html
        this.props.showChapter(this.props.idx, url);
    }

    render(){
       
         // nowrap 不斷行; overflow 超過範圍就隱藏
        return <li style={{padding: '7px 0 0 2px', display:'inline', float:'left', width:'280px', overflow: 'hidden' , whiteSpace: 'nowrap' }} > 
                <a href="" data-link={this.props.href} onClick={this.onClickChapter} >{this.props.title}</a>
        </li>;
    }
}