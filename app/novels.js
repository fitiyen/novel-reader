import React from 'react';
import ReactDOM from 'react-dom';
import NovelsForm from './novelsForm';
import Axios from 'axios';
import Novel from './novel';
import View from './view';
import CSS from '../css/main.css'

export default class Novels extends React.Component{
    constructor(props){
        super(props);
        this.onAdd = this.onAdd.bind(this);
        this.onClickNovel = this.onClickNovel.bind(this);
        this.setViewStateFn = this.setViewStateFn.bind(this);
        //this.onKeyUp = this.onKeyUp.bind(this);

        this.state = {
            novels : (this.props.novels || []),
            contents: [],
            activeNovel: {},
        }
    }

    onAdd(novel){
        this.state.novels.push(novel);
        this.setState({
            novels: this.state.novels
        });
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
            this.fn(true);
        }
    }

    setViewStateFn(fn){
        this.fn = fn;
    }

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

        return <div>
            <NovelsForm onAdd={this.onAdd} />
            <div>
                <div className={CSS.leftDiv} >
                    <ul>
                        {novels}
                    </ul>
                </div>
                <View activeNovel={this.state.activeNovel} contents={this.state.contents} setViewStateFn={this.setViewStateFn}/>
            </div>
        </div>
    }
} 


ReactDOM.render(<Novels/>, document.getElementById('container'));