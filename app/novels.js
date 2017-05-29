import React from 'react';
import ReactDOM from 'react-dom';
import NovelsForm from './novelsForm';
import Axios from 'axios';
import Novel from './novel';

export default class Novels extends React.Component{
    constructor(props){
        super(props);
        this.onAdd = this.onAdd.bind(this);
        this.onBack = this.onBack.bind(this);
        this.onClickNovel = this.onClickNovel.bind(this);
        this.onClickChapter = this.onClickChapter.bind(this);
        this.state = {
            novels : (this.props.novels || []),
            contents: [],
            activeNovel: {},
            showContents: true,
            chapter:""
        }
    }

    onAdd(novel){
        this.state.novels.push(novel);
        this.setState({
            novels: this.state.novels
        });
    }

    onBack(){
        this.setState({showContents: true});
    }

    onClickNovel(novel){
        if (novel){
            var that = this;
            Axios.get('/novelContents', {
                params: {
                    url: novel.fullHost+novel.contentUrl
                }
            }).then(function(res){
                var novelContents = res.data;
                that.setState({contents: novelContents.list, activeNovel: novel, showContents: true});
            });
        }
    }

    onClickChapter(evt){
        var that = this;
        var href = evt.target.href;
        evt.preventDefault();//不執行 href 的轉址功能
        Axios.get('/chapter', {
            params: {
                url: href
            }
        }).then(function(res){
            that.setState({showContents:false, chapter: res.data.chapter})
        })
    }
    /*getChapterByContents(idx){
        var chapter = this.contents[idx];
        return chapter;
    }
    
    showContents(show){
        this.setState({showContents:show})
    }*/

    render(){
        //warning.js:36 Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of `Novels`. See https://fb.me/react-warning-keys for more information.
        //in Novel (created by Novels)
        //in Novels
        var that = this;
        var fullHost = this.state.activeNovel.fullHost;
        var novels = this.state.novels.map(function(novel, index) {
            return <Novel onClickNovel={that.onClickNovel} key={index} title={novel.title} wedge={novel.wedge} 
                contentUrl={novel.contentUrl} fullHost={novel.fullHost} />;
        });

         var contents = this.state.contents.map(function(content, index) {
            // nowrap 不斷行; overflow 超過範圍就隱藏
            return <li style={{padding: '7px 0 0 2px', display:'inline', float:'left', width:'280px', overflow: 'hidden' , whiteSpace: 'nowrap' }} key={index}> 
                <a href={fullHost+content.href} onClick={that.onClickChapter} >{content.title}</a>
            </li>;
        });
        return <div>
            <NovelsForm onAdd={this.onAdd} />
            <div>
                <div style={{width: '20%', float:'left'}} >
                    <ul>
                        {novels}
                    </ul>
                </div>
                <div id="contents" style={{width: '79%', float:'left', border: '1px solid black', display: !this.state.showContents?'none':'' }}>
                    <b>{this.state.activeNovel.title}</b>
                    <ul>
                        {contents}
                    </ul>
                </div>
                <div id="chapter" style={{width: '79%', float:'left', border: '1px solid red', display: this.state.showContents?'none':'' }}>
                    <pre style={{whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontSize: '20px', textIndent: '30px', lineHeight: '40px', margin: '0 auto'}}>
                        {this.state.chapter}
                    </pre>
                    <div>
                        <button onClick={this.onBack}>回目錄</button>
                    </div>
                </div>
            </div>
        </div>
    }
} 


ReactDOM.render(<Novels/>, document.getElementById('container'));