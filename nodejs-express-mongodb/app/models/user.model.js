module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        username: String,
        password:String,
        email:String, 
        role: 
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        },
        firstName: String,
        middleName: String,
        lastName: String, 
        department: String,
        daysAllocated:Number,
        daysUsed:Number,
        daysLeft:Number,
        published: Boolean,
        googleId:Number,
        facebookId:Number
        
      },
      
      { timestamps: true }
    );
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
    const User= mongoose.model("user", schema);
    return User;
  };



