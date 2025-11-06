import React, { useEffect, useState } from "react";
import "./SearchItem.css"

const SearchItem = () =>{
    return(
        <div className="input-group rounded-3 border border-2">
            {/* Icon Search */}
            <span className="input-group-text bg-white border-0 rounded-start-5">
                <i className="fa-solid fa-magnifying-glass"></i>
            </span>
            {/* Input Field */}
            <input
                type="text"
                className="form-control border-0"
                placeholder="Tìm kiếm..."
                style={{
                height: "40px",
                }}
            />
        </div>
    );
};

export default SearchItem;