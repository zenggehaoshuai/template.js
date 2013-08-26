(function(root){
    //定义一些常用的方法
    var trim = function(str){
            return typeof str.trim !== "undefined" ? str.trim() : str.replace(/^\s*|\s*$/g,"");
        },
        clearIllegalLabel = function(str){
            return str.replace(/('|\\|\r?\n)/g, '\\$1');
        },
        compile = function(html){
            var beginStr = "<%",endStr = "%>",beginLength = beginStr.length,endLength = endStr.length,bIndex = html.indexOf(beginStr),eIndex,tempStr;
            var execStr = "var __ = '';with(_$||{}){";
            while(bIndex != -1){
                eIndex = html.indexOf(endStr);
                if(eIndex < bIndex) break;
                execStr += "__+='"+clearIllegalLabel(html.substring(0,bIndex))+"';";
                tempStr = trim(html.substring(bIndex+beginLength,eIndex));
                if(tempStr.charAt(0) === "="){
                    tempStr = tempStr.substring(1);
                    execStr += "(typeof("+tempStr+") !== 'undefined') && (__+="+tempStr+");";
                }else{
                    execStr += tempStr;
                }
                html = html.substring(eIndex+endLength);
                bIndex = html.indexOf(beginStr);
            }
            execStr += "__+='"+clearIllegalLabel(html)+"'};return __;";;
            this.render = new Function("_$",execStr);
        };

    (typeof exports === "undefined" ? root : exports).template = (function(){
        return function(html,data){
            html = (/^#\w+$/.test(html)) ? document.getElementById(html.substring(1)).innerHTML : html;
            var Compile = new compile(html);
            return Compile.render(data);
        }

    })();
})(this);
