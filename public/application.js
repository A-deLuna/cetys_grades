var ReactBootstrap = require ('react-bootstrap');
var React = require('react');
var GithubRibbon = require('react-github-fork-ribbon');

var Alert = ReactBootstrap.Alert;
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;
var Glyphicon = ReactBootstrap.Glyphicon;


var style = {maxWidth: 400, margin: 'auto', padding: '15px'};
var tableStyle = {maxWidth: 600, margin: 'auto', padding: '10px'};

var App = React.createClass({
  getInitialState: function(){
    return {courses: [], showLogin: true};
  },
  render:function(){
    if(this.state.showLogin){
      return (
        <div style= {style}>
          <GithubRibbon href="https://github.com/OneKorg/cetys_grades"
                        target="_blank" 
                        color="black"
                        position ="right">
            Fork me on Github
          </GithubRibbon>
          <LoginForm onButtonClick={this.loadGrades}/>
          <GradesTable courses={this.state.courses}/>
        </div>
        
      );
    }
    else{
      return(
        <div style={tableStyle}>
          <GradesTable courses={this.state.courses}/>
        </div>
      );
    }
  },
  hideLogin: function(){
  },
  loadGrades: function(user){
    $.ajax({
      url: 'grades',
      dataType: 'json',
      type:'POST',
      data: user,
      success: function(data){
        this.setState({showLogin: false});
        this.setState({courses:data.courses});
      }.bind(this),
      error: function(xhr, status, err){
        console.error('grades',status, err.toString());
      }.bind(this)
    });
  }
});
var LoginForm = React.createClass({
  render: function(){
    var divStyle = {
      maxWidth: "400px",
      margin: "20px auto auto",
      backgroundColor: "rgb(250,250,210)",
      boxShadow: "0px 0px 25px rgb(201, 167, 0)",
      padding: "15px 15px 15px 15px"

    };
    var pStyle= {
      textAlign: "center",
      fontStyle: "italic",
      marginBottom: "0px"
    };
    return (
      <div className="panel" style={divStyle}>
        <form onSubmit = {this.handleSubmit} style={{textAlign: "center" }}>
          <img src="img/LogoCetys.gif" width="80%" alt="Logo Cetys" style={{marginBottom: "15px"}}/>
          <Input addonBefore = {<Glyphicon glyph="user"/>} type="text" placeholder="m0XXXXX" ref='student'/>
          <Input addonBefore = {<Glyphicon glyph="lock"/>} type='password' placeholder="Contrase&ntilde;a" ref='password'/>
          <Input type='checkbox' label = "Recordarme" />
          <Input type='submit' value = "Ingresar" bsStyle="warning"/>
        </form>
        <p style={pStyle}>Por alumnos, para alumnos.</p>
      </div>
    );
  },
  handleSubmit: function(e){
    e.preventDefault();
    var user = this.refs.student.getInputDOMNode().value.trim();
    var password = this.refs.password.getInputDOMNode().value.trim();
    this.props.onButtonClick({user: user, password:password});
  }

});
var GradesRow = React.createClass({
  render: function(){
    var tableGrades = this.props.grades.map(function( grade ){
      return (
        <td>{grade}</td>
      );
    });
    return (
      <tr>
        <td>{this.props.name}</td>
        {tableGrades}
      </tr>
    );
  }
});
var GradesTable = React.createClass({
  render: function(){
    var tableRows = this.props.courses.map(function(data){
      console.log(data);
      return (
        <GradesRow name={data.name} grades={data.grades}/>
      );
    });
    return (
      <div className="table">
      <Table responsive striped>
        <tbody>
          {tableRows}
        </tbody>
      </Table>
      </div>
    );
  }
});

React.render(
  <App />,
  document.getElementById("content") 
);
