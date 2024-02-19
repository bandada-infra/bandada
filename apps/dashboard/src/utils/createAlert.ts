export default function capitalize(data: { message: string; }) {
    if (data.message){
        alert(data.message);
    }else{
        alert("Some error occurred!");
    }
}
