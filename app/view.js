import React from 'react';
import Axios from 'axios';
import Content from './content';
import Chapter from './chapter';
import CSS from '../css/main.css'

export default class View extends React.Component{

    constructor(props){
        super(props);//activeNovel, contents, showContents
        this.showChapter = this.showChapter.bind(this);
        this.showContents = this.showContents.bind(this);
        this.moveTo = this.moveTo.bind(this);
        this.handleSwipe = this.handleSwipe.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.state = {
            showContents : (this.props.showContents || true),
            currChapter : {}
        }
        
        this.props.setViewStateFn(this.showContents);
        document.addEventListener("keyup", this.onKeyUp);
    }

    showContents(show){
        this.setState({showContents:show});
    }

    showChapter(index, url){//傳到 content 元件
        var that = this;
        var fullHost = this.props.activeNovel.fullHost;
        url = fullHost + url;
        Axios.get('/chapter', {
            params: {
                url: url
            }
        }).then(function(res){
            that.setState({currChapter: {index: index, content: res.data.chapter}, showContents:false});
        })
    }

    moveTo(pos){//傳到 chapter 元件
        var contents = this.props.contents;
        if (!contents || contents.length == 0){
            return;
        }
        //負數: 上一章, 0: 回目錄, 正數: 下一章
        if (pos == 0){
            if (this.state.showContents){
                alert('已經在目錄囉');
                return;
            }
            this.showContents(true);
        }else{            
            var currChapter = this.state.currChapter;
            var nextIdx = !currChapter.hasOwnProperty('index') ? 0 : currChapter.index + pos;
            if (nextIdx < 0 ){
                alert('已經是第一章囉');
                return;
            }else if(nextIdx > contents.length-1){
                alert('已經是最後一章囉');
                return;
            }
            var nextChapter = contents[nextIdx];
            this.showChapter(nextIdx, nextChapter.href);
        }
    }

    //電腦版 鍵盤事件
    onKeyUp(event){
        var keyCode = event.keyCode;
        if (keyCode == 37){//左鍵: 上一章
            this.moveTo(-1);
        }else if (keyCode == 39){//右鍵: 下一章
            this.moveTo(1);
        }else if (keyCode == 36){//Home鍵: 回目錄
            this.moveTo(0);
        }
    }
    //unable to preventDefault touchstart https://segmentfault.com/a/1190000007621605
    onTouchStart(event){
        var touchObj = event.changedTouches[0];
        var obj = {};
        obj.threshold = 100; //required min distance traveled to be considered swipe
        obj.restraint = 100; // maximum distance allowed at the same time in perpendicular direction
        obj.allowedTime = 300;
        obj.startX = touchObj.pageX;
        obj.startY = touchObj.pageY;
        obj.startTime = new Date().getTime(); // record time when finger first makes contact with surface
        this.state.touchObj = obj;
    }
    onTouchEnd(event){
        var touchObj = event.changedTouches[0];
        var obj = this.state.touchObj;
        var swipeDir = 'none';
        var distX = touchObj.pageX - obj.startX; // get horizontal dist traveled by finger while in contact with surface
        var distY = touchObj.pageY - obj.startY; // get vertical dist traveled by finger while in contact with surface
        var elapsedTime = new Date().getTime() - obj.startTime; // get time elapsed
        if (elapsedTime <= obj.allowedTime){ // first condition for awipe met
            if (Math.abs(distX) >= obj.threshold && Math.abs(distY) <= obj.restraint){ // 2nd condition for horizontal swipe met
                swipeDir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
            }
            else if (Math.abs(distY) >= obj.threshold && Math.abs(distX) <= obj.restraint){ // 2nd condition for vertical swipe met
                swipeDir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
            }
        }
        this.handleSwipe(swipeDir);
        //event.preventDefault(); 多這句會導致沒有觸發click
    }

    handleSwipe(dir){
        if (dir == 'right'){
            this.moveTo(-1); 
        }else if (dir == 'left'){
            this.moveTo(1);
        }
    }
    
    render(){
        var that = this;
        var contents = this.props.contents.map(function(content, index) {
            return <Content activeNovel={that.props.activeNovel} showChapter={that.showChapter} 
                href={content.href} key={index} title={content.title} idx={index}/>
        });
        //<div id="contents" style={{width: '69%', float:'left', border: '1px solid black', display: !this.state.showContents?'none':'' }}>
        //<div id="chapter" style={{width: '69%', float:'left', border: '1px solid red', display: this.state.showContents?'none':'' }}>
        return <div onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd}>
            <div id="contents" className={CSS.rightContentsDiv +' '+ (!this.state.showContents? CSS.hidden : '')}>
                <b>{this.props.activeNovel.title} </b>
                <ul>
                    {contents}
                </ul>
            </div>
            <div id="chapter" className={CSS.rightChapterDiv +' '+ (this.state.showContents? CSS.hidden : '')}>
                <Chapter chapter={this.state.currChapter} moveTo={this.moveTo}/>
            </div>
        </div>
    }
}