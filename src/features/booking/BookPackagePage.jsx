import {useState} from "react";
import {useParams,useNavigate} from "react-router-dom";
import {createPackageBooking} from "../../api/bookingApi";
import {useAuth} from "../../context/AuthContext";


const BookPackagePage=()=>{


const {id}=useParams();
const navigate=useNavigate();
const {user}=useAuth();



const [form,setForm]=useState({

start_date:""

});



const handleChange=(e)=>{

setForm({
...form,
[e.target.name]:e.target.value
});

};



const handleSubmit=async(e)=>{

e.preventDefault();


await createPackageBooking({

package:id,
...form

});


navigate("/my-package-bookings");

};



if(user?.role!=="traveler"){
return <p>Access Denied</p>;
}



return (

<div>

<h2>Book Package</h2>


<form onSubmit={handleSubmit}>


<input
type="date"
name="start_date"
onChange={handleChange}
/>


<button>
Book Now
</button>


</form>

</div>

);


};


export default BookPackagePage;