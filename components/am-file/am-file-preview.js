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
            :host{
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .cont {
                width: 300px;
                height: 64px;
                display:flex;
                flex-direction:column;
                box-sizing: border-box;
                border: 1px solid var(--grey-light);
                border-radius: 4px;
            }

            .file-info-container {
                width: 300px;
                display:flex;
                flex-direction:row;
                height: 100%;
            }

            .img {
                align-self:center;
                margin: 8px;
            }

            progress {
                width: 100%;
            }

            .data-container {
                display: flex;
                flex-direction: column;
                flex: 1;
                margin-right: 8px;
                justify-content: center;
            }

            .name {
                font-family: 'Golos Regular';
                font-weight: 500;
                font-size: 13px;
                line-height: 150%;
            }

            .size {
                font-size: 12px;
                color: var(--grey-dark);
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
                <div class="cont">
                    <div class="file-info-container">
                        <div class="img">
                            <lit-icon iconset="iconset-32" size="32" icon="upload"></lit-icon>
                        </div>
                        <div class="data-container">
                            <div class="name" >
                                ${file.name}                    
                            </div>
                            <div class="size">${this.getFileSize(file.loaded, file.size)}</div>
                        </div>
                    </div>
                    <progress class="progress"  max="100" value="${file.progress}"></progress>
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
