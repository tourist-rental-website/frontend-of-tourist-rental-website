import {useEffect,useState} from "react";
import {
getMyPackageBookings,
cancelPackageBooking
} from "../../api/bookingApi";


const MyPackageBookingsPage=()=>{


const [bookings,setBookings]=useState([]);



const loadBookings=async()=>{

const data = await getMyPackageBookings();

setBookings(data);

};



useEffect(()=>{

loadBookings();

},[]);



const handleCancel=async(id)=>{

await cancelPackageBooking(id);

loadBookings();

};



return (

<div>

<h2>My Package Bookings</h2>


{
bookings.map((b)=>(

<div key={b.id}>

<h3>{b.package?.title}</h3>


<p>
Start: {b.start_date}
</p>


<p>
Status: {b.status}
</p>


{
(b.status==="pending" ||
b.status==="confirmed") && (

<button onClick={()=>handleCancel(b.id)}>
Cancel
</button>

)}

</div>

))

}

</div>

);


};


export default MyPackageBookingsPage;