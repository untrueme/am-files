import { LitElement, html, css } from 'lit';
import '/components/am-file/am-file-preview.js';
import 'lit-icon/pkg/dist-src/lit-icon.js';

class AmFileUpload extends LitElement {
    static get properties() {
        return {
            dragActive: {
                type: Boolean,
                reflect: true
            },
            multiple: {
                type: Boolean,
                reflect: true
            },
            files: {
                type: Array,
                value: [],
                attribute: false
            },
            required: {
                type: Boolean,
                reflect: true
            },
            accept: {
                type: String
            }
        }
    }

    static get styles() {
        return css`
            :host {
                display:flex;
                flex-direction: column;
            }

            .uploader-container{
                width: 300px;
                height: 108px;
                border: 2px dashed var(--grey-lightest);
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                font-size: 13px;
                padding: 16px;
                display: flex;
                gap: 8px;
                color: var(--grey-dark);
                line-height: 130%;
                text-align: center;
            }

            :host([hidden]) .uploader-container{
                display: none !important;
            }

            lit-icon {
                width: 32px;
                height: 32px;
            }


            :host([required]) .uploader-container{
                background: #FFE5B6
            }

            :host(:hover) .uploader-container{
                background: var(--grey-lightest);
                border: 2px dashed  var(--grey-dark);
            }

            :host([dragactive]) .uploader-container{
                background: var(--primary-lightest);
                border: 2px dashed  var(--primary-base);
                color: var(--primary-light);
            }
        `;
    }

    render() {
        return html`
            <div class="uploader-container" @click=${this.onFileClick}>
                <input title="uploader" id="fileInput" accept="${this.accept}" type="file" multiple=${this.multiple} @change="${this.onFileInputChange}" hidden/>
                <lit-icon iconset="iconset-32" size="32" icon="upload"></lit-icon>

                <span class="hint">???????????????????? ?????????? ?????? ?????????????? ??????????, ?????????? ??????????????????</span>
            </div>
            <am-file-preview .files=${this.files}></am-file-preview>
        `;
    }

    constructor() {
        super();
        this.addEventListener("dragenter", this.dragenter, false);
        this.addEventListener("dragover", this.dragover, false);
        this.addEventListener("dragleave", this.dragleave, false);
        this.addEventListener("drop", this.drop, false);
        this.files = [];
    }

    onFileClick() {
        this.shadowRoot.querySelector('#fileInput').click()
    }

    dragenter(e) {
        e.dataTransfer.dropEffect = 'copy';

        e.stopPropagation();
        e.preventDefault();
    }

    dragleave(e) {
        this.dragActive = false;
        e.stopPropagation();
        e.preventDefault();

    }

    dragover(e) {
        this.dragActive = true;
        e.stopPropagation();
        e.preventDefault();
    }

    drop(e) {
        this.dragActive = false;
        e.stopPropagation();
        e.preventDefault();
        var dt = e.dataTransfer;
        var files = dt.files;

        for (var i = 0; i < dt.files.length; i++) {
            const file = dt.files[i];
            if (!this.acceptFile(file, this.accept)) {
                return false;
            }
        };

        this.handleFiles(files);
    }

    onFileInputChange(e) {
        var files = e.target.files;
        this.handleFiles(files);
    }

    acceptFile(file, acceptedFiles) {
        if (file && acceptedFiles) {
            var acceptedFilesArray = Array.isArray(acceptedFiles) ? acceptedFiles : acceptedFiles.split(',');
            var fileName = file.name || '';
            var mimeType = (file.type || '').toLowerCase();
            var baseMimeType = mimeType.replace(/\/.*$/, '');
            return acceptedFilesArray.some(function (type) {
                var validType = type.trim().toLowerCase();

                if (validType.charAt(0) === '.') {
                    return fileName.toLowerCase().endsWith(validType);
                } else if (validType.endsWith('/*')) {
                    return baseMimeType === validType.replace(/\/.*$/, '');
                }

                return mimeType === validType;
            });
        }

        return true;
    }

    handleFiles(uploadedFiles) {
        if (this.multiple) {
            for (var i = 0; i < uploadedFiles.length; i++) {
                const file = uploadedFiles[i];
                file.loaded = 0;
                file.progress = 0;
                file.value = '';
                this.files.push(file);
                this.uploadFile(file, i);
            };
        }
        else {
            this.files = [];
            const file = uploadedFiles[0];
            file.loaded = 0;
            file.progress = 0;
            file.value = '';
            this.files.push(file);
            this.uploadFile(file, i);
        }
    }

    uploadFile(file) {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        const url = 'upload';
        const idx = this.files.indexOf(file);
        formData.append('file', file, file.name);
        this.files = [...this.files];
        xhr.upload.onprogress = (event) => {
            const done = event.loaded;
            const total = event.total;
            const progress = Math.floor((done / total) * 1000) / 10;
            this.files[idx].loaded = done;
            this.files[idx].progress = progress;
            this.files = [...this.files];
        };

        xhr.open('POST', url, true);
        xhr.onload = (event) => {
            if (event.target.status == 200) {
                const resp = JSON.parse(event.target.response);
                if (resp.id) {
                    this.files[idx].value = resp.id;
                    this.files = [...this.files];
                }
            }
        };
        xhr.send(formData);
    }
}

customElements.define('am-file-upload', AmFileUpload);
