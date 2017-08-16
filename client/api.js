export default function ajax(url, method, data){
    return new Promise(resolve, reject){
        const xhttp = new XMLHttpRequest();
        xhttp.open(url, method, true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        if(data){
            xhttp.send(JSON.stringify(data));
        }else{
            xhttp.send();
        }
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4){
                if(this.status == 200){
                    resolve(this.responseText);
                }else{
                    reject({error: 'Request failed', url});
                }
            }
        };
    }
}