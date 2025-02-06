
let DayPicker = () => {
    return (
        <div className="dowPicker">
        <div className="dowPickerOption">
          <input type="checkbox" id="dow1" name="sunday" className="sunday"/>
          <label htmlFor="dow1">S</label>
        </div>
        <div className="dowPickerOption">
          <input type="checkbox" id="dow2" name='monday' className="monday"/>
          <label htmlFor="dow2">M</label>
        </div>
        <div className="dowPickerOption">
          <input type="checkbox" id="dow3" name="tuesday" className="tuesday"/>
          <label htmlFor="dow3">T</label>
        </div>
        <div className="dowPickerOption">
          <input type="checkbox" id="dow4" name="wednesday" className="wednesday"/>
          <label htmlFor="dow4">W</label>
        </div>
        <div className="dowPickerOption">
          <input type="checkbox" id="dow5" name="thursday" className="thursday"/>
          <label htmlFor="dow5">T</label>
        </div>
        <div className="dowPickerOption">
          <input type="checkbox" id="dow6" name="friday" className="friday"/>
          <label htmlFor="dow6">F</label>
        </div>
        <div className="dowPickerOption">
          <input type="checkbox" id="dow7" name="saturday" className="saturday"/>
          <label htmlFor="dow7">S</label>
        </div>
      </div> 
    )
}

export default DayPicker;