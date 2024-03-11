const kaoCommonFunctions = {
    giftCardPreview : function(params) {
        $('.gift-msg-preview-btn').on('click', function(){
            const hasInvalidChar = params.textArea.next("span").is(":visible");
            const msgContent = params.textArea.val();

            let splitted = [];
            msgContent.split('\n').forEach(function(x){
                let s = String(x);
                const size = params.charsInRow;
                while(s.length > 0){
                    splitted.push(s.substring(0,size).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
                    s = s.substring(size);
                }
            });

            const maxRow = params.maxRow;
        
            $('.preview-box-content').html(splitted.slice(0, maxRow).join('<br/>'));

            const tooManyRows = $("p#preview-too-many-rows");
            const hasTooManyRows = splitted.length > maxRow;
            hasTooManyRows ? tooManyRows.show() : tooManyRows.hide();
        
            const tooLong = $("p#preview-too-long");

            const getSJISByteLength = function(str) {
                let length = 0;
                for(let i=0; i < str.length; i++){
                    let c = str.charCodeAt(i);
                    if ((c >= 0x0 && c < 0x81) || (c === 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
                        length += 1;
                    } else {
                        length += 2;
                    }
                }
                return length;
            }

            const exceedsMaxByte = getSJISByteLength(msgContent) > params.maxByte;
            exceedsMaxByte ? tooLong.show() : tooLong.hide();
        
            $('.preview-box-title').text($("input[id='messageInformation.messageTo']").val());
            $('.preview-box-name').text($("input[id='messageInformation.messageFrom']").val());

            const textNg = hasInvalidChar || hasTooManyRows || exceedsMaxByte;
            if(params.afterPreview !== undefined){
                params.afterPreview(!textNg);
            }
            else{
                $("button.btn--continue-checkout").prop("disabled", textNg);
                $('.gift-msg-preview-btn').removeClass('msgConfirmed');
            }

        });
    
    },

    messageDetailReplaceNewLine : function(params) {
        const messageDetailArea = params.textArea

        const messageDetail = messageDetailArea.val();
        if(messageDetail && messageDetail.length !== 0)
        {
            messageDetailArea.val( String(messageDetail).replace(/\\n/g, "\n"));
        }

    },

    orderDetailMessageViewFormat : function() {
        $('.messageView').each(function(_, element) {
            const msgContent = $(element).text();
            if(msgContent && msgContent.length !== 0 && msgContent.indexOf("\\n") !== -1)
            {
                $(element).text( String(msgContent).replace(/\\n/g, " "));
            }
        });
    }

};