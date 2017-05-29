import React from 'react';
import Axios from 'axios';
import Url from 'url';

export default class NovelsForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            url: 'http://tw.fxnzw.com/fxnbook/44891.html',
        }
    }

    handleClick() {
        var that = this;
        var url = this.refs.urlInput.value;
        this.setState({ url: url });
        //這裡還是前端，在這邊訪問小說的網站會因為'同域限制'被擋下
        Axios.get('/novelInfo', {
            params: {
                url: url
            }
        }).then(function(res){
            console.log(res.data);
            var novel = res.data;
            var pathname = Url.parse(url).pathname;
            var fullhost = url.substring(0, url.indexOf(pathname));
            that.props.onAdd({
                title: novel.title,
                wedge: novel.wedge,
                contentUrl: novel.contentUrl,
                fullHost: fullhost
            });
        });
    }

    render() {
        return (
            <div>
                <input type='input' style={{ width: 300 + 'px' }} defaultValue={this.state.url} ref="urlInput" />
                <button type='button' onClick={this.handleClick}>Add</button>
            </div>
        );
    }
}
