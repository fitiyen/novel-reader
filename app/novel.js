import React from 'react';

export default class Novel extends React.Component{
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            contents : []
        }
    }

    handleClick(){
        var props = this.props;
        var novel = { };
        ({title: novel.title, contentUrl: novel.contentUrl, fullHost: novel.fullHost} = props);
        this.props.onClickNovel(novel);
        /*var that = this;
        Axios.get('/novelContents', {
            params: {
                url: this.props.fullHost + this.props.contentUrl
            }
        }).then(function(res){
            var novelContents = res.data;
            that.setState({contents: novelContents.list});
        });*/
    }

    render(){
        //contents 寫在這個位置的話，每一本小說都會有各個獨立的區塊來顯示目錄，但我要的效果不是這樣，所以搬到 novels.js 去。
        /*var fullHost = this.props.fullHost;
        var contents = this.state.contents.map(function(content, index) {
            // nowrap 不斷行; overflow 超過範圍就隱藏
            return <li style={{padding: '7px 0 0 2px', display:'inline', float:'left', width:'280px', overflow: 'hidden' , 'white-space': 'nowrap' }} key={index}> <a href={fullHost+content.href}>{content.title}</a> </li>;
        });
        return <div>
            <div style={{width: '20%', float:'left'}} onClick={this.handleClick}>
                <h2>{this.props.title}</h2>
                <p>{this.props.wedge}</p>
            </div>
            <div style={{width: '79%', float:'left', border: '1px solid black' }}>
                <ul>
                    {contents}
                </ul>
            </div>
        </div>*/
        //http://www.css88.com/archives/2422 使 pre 的內容自動換行
        return <li onClick={this.handleClick}>
                <b>{this.props.title}</b>
                <pre style={{whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}>{this.props.wedge}</pre>
            </li>
    }
} 