function HotelCard({hotel}){
    return(
        <div className="hotel-card">
            <img src={hotel.image} alt={hotel.name} />
            <div className="hotel-overlay">
        </div>
    )
}