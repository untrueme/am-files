import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

class AmFilePreview extends LitElement {
    static get properties() {
        return {
            files: {
                type: Array,
                attribute: false
            },
            closable: {
                type: Boolean
            }
        }
    }

    static get styles() {
        return css`
            .file-info-container {
                width: 484px;
                height: 64px;
                background: rgba(242, 244, 248, 0.6);
                display:flex;
                flex-direction:row;
            }

            .img {
                align-self:center;
                margin: 8px;
            }

            .progress {
                width: 100%;
            }

            .data-container {
                display: flex;
                flex-direction: column;
                flex: 1;
                margin-right: 8px;
                justify-content: center;
            }
        `;
    }

    constructor() {
        super();
        this.files = [];
    }

    render() {
        return html`
            ${repeat(this.files, (file) => file.id, (file, index) => html`
            <div class="file-info-container">
                <div class="img">
                     <img width="48px" height="48px">
                </div>
                <div class="data-container">
                    <div class="name" >
                        ${file.name}                    
                    </div>
                    <progress class="progress"  max="100" value="${file.progress}"></progress>
                    <div class="size">${this.getFileSize(file.loaded, file.size)}</div>
                </div>
            </div>
            `)}
        `;
    }

    _getSrc(item) {
        return '';
    }

    getFileSize(loaded, size) {
        return loaded && size ? `${(loaded / 1024).toFixed(2)} KB / ${(size / 1024).toFixed(2)} KB` : '';
    }

    onCloseTap(event) {
        //this.splice('files', event.model.index, 1);
    }
}

customElements.define('am-file-preview', AmFilePreview);
