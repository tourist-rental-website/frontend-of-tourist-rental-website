import {useState} from "react";
import {useParams,useNavigate} from "react-router-dom";
import {createRoomBooking} from "../../api/bookingApi";
import {useAuth} from "../../context/AuthContext";


const BookRoomPage=()=>{


const {id}=useParams();
const navigate=useNavigate();
const {user}=useAuth();



const [form,setForm]=useState({

check_in:"",
check_out:""

});



const handleChange=(e)=>{

setForm({
...form,
[e.target.name]:e.target.value
});

};



const handleSubmit=async(e)=>{

e.preventDefault();


await createRoomBooking({

room:id,
...form

});


navigate("/my-room-bookings");

};



if(user?.role!=="traveler"){
return <p>Access Denied</p>;
}



return (

<div>

<h2>Book Room</h2>


<form onSubmit={handleSubmit}>


<input
type="date"
name="check_in"
onChange={handleChange}
/>


<input
type="date"
name="check_out"
onChange={handleChange}
/>


<button>
Book Now
</button>


</form>

</div>

);


};


export default BookRoomPage;