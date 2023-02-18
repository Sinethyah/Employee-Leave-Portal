module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        title: String,
        description:String,
        username:String,
        userID:String,
        email:String, 
        status:String,
        startDateRequested:String,
        endDateRequested:String,
        startTimeRequested:String,
        endTimeRequested:String,
        diffDatesRequested:Number,
        startDateApproved: String,
        endDateApproved:String,
        startTimeApproved:String,
        endTimeApproved:String,
        diffDatesApproved:Number,
        employerComments:String,
        successfulRequest:Boolean

      },
      
      { timestamps: true }
    );
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
    const Request= mongoose.model("request", schema);
    return Request;
  };



