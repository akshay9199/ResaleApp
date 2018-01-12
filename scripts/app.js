
angular.module("myapp",["ui.router","firebase"])
.controller("AdCtrl",AdCtrl)
.controller("showItem",showItem)
.controller("Welcome",Welcome)
.controller("Proofile",Proofile)
.service("content",content)
.service("gather",gather)
.service("menu",menu)
.service("searchit",searchit)
.service("myadds",myadds)
.service("ShowThat",ShowThat)
.factory("auth",function($firebaseAuth){
  return $firebaseAuth();
}).run(function(){
    
})
.config(function($stateProvider,$urlRouterProvider)
{
  
$stateProvider

      .state("login",{
          url: "/login",
          templateUrl : "views/login.html",
          controller: "Welcome",
          controllerAs: "w",      
          "resolve":{
             user : function(auth,$state){
                    return auth.$waitForSignIn()
                
                  }
          }
      })
      .state("signup",{
          url: "/signup",
          templateUrl : "views/signup.html",
          controller: "Welcome",
          controllerAs: "w",      
          "resolve":{
             user : function(auth,$state){
                     return auth.$waitForSignIn()
                
                  }
          }
      })
	   .state("adhar",{
        url:"/adhar",
        templateUrl : "views/adhar.html",
    })
      .state("homepage",{
        url:"/homepage",
        templateUrl : "views/homepage.html",
        controller: "AdCtrl",
        controllerAs: "data",     
        "resolve":{
             user : function(auth,$state){
                    return auth.$waitForSignIn()
                
                  }
          }      
    
  
})
      .state("forgotpassword",{
        url:"/forgot-password",
        templateUrl : "views/ftpd.html",
        controller: "Welcome",
        controllerAs: "w",     
"resolve":{
             user : function(auth,$state){
                    return auth.$waitForSignIn()
                
                  }
          }      
    
  

})

      .state("homepage.post",{
        url:"/post",
        templateUrl : "views/post.html",
        controller: "AdCtrl",
        controllerAs: "data", 
  "resolve":{
             user : function(auth,$state){
                    return auth.$waitForSignIn()
                
                  }
          }    
    
  })


      .state("homepage.viewitem",{
        url:"/view",
        templateUrl : "views/view.html",
        controller: "showItem",
        controllerAs: "data", 
  "resolve":{
             user : function(auth,$state){
                    return auth.$waitForSignIn()
                
                  }
          }    
    
  })
      .state("homepage.profile",{
        url:"/profile",
        templateUrl : "views/profile.html",
    "resolve":{
             user : function(auth,$state){
                    return auth.$waitForSignIn()
                
                  }
          } 
     })
	
	 
      
      .state("homepage.categories",{
          url: "/categories",
          templateUrl : "views/categories.html",
          "resolve":{
             Accounts :function($firebaseArray) 
             {
             var rootRef=firebase.database().ref()
             var childref=rootRef.child("Accounts")
             return $firebaseArray(childref).$loaded();
             },
             user : function(auth){
                return auth.$waitForSignIn()
             }
         }

      })
      $urlRouterProvider.otherwise("login");

})

function content()
{
  return {};
}
function searchit()
{
  return [];
}
function menu()
{
  return [];
}
function myadds()
{
  return [];
}

function ShowThat()
{
  return {};
}
function AdCtrl($rootScope,myadds,$firebaseArray,$firebaseAuth,ShowThat,gather,$firebaseStorage,$firebaseObject,content,$state,menu)
{
  //console.log($rootScope.gather.displayName);
var data=this;
//data.menu.selected={};
data.searchsearch={};
data.selected={};
console.log(data.selected);
data.selected=ShowThat;
var rootRef=firebase.database().ref();
var childRef=rootRef.child("Ads");
var root=firebase.database().ref();
var child=root.child("Accounts");
data.Accounts=$firebaseArray(child);
data.all = menu;
searchit=data.textsearch;data.searchsearch=searchit;
console.log(searchit);
data.person={};
data.person.profilepic=$rootScope.gather.user.photoURL;
data.all.ads=$firebaseArray(childRef);
$rootScope.myadds=data.all.ads;
console.log(ShowThat);
ShowThat=data.selected;
//console.log(data.selected);
data.showcontent=function(t)
{

  console.log(t);
  $rootScope.content=t;
}
data.post=function(t)
{
   //console.log(t);
  var file=document.getElementById("file").files[0];
  console.log(file);
   data.all.ads.$add(t).then(function(ref)
 {
   var id = ref.key;
   console.log("added record with id " + id);
   var index=data.all.ads.$indexFor(id); 
   
//storing image
    var storageRef = firebase.storage().ref("ads/" + id);
    storage = $firebaseStorage(storageRef);
    
   
     var uploadTask = storage.$put(file);
     uploadTask.$progress(function(snapshot) {
    
     var percentUploaded = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
     console.log(percentUploaded);
    })
      uploadTask.$complete(function(snapshot) {
      console.log(snapshot.downloadURL);
      var link=snapshot.downloadURL;


      //adding to db
       data.all.ads[index].dop=new Date().toDateString();      
      data.all.ads[index].imageUrl = link;
      //var pmail=data.ads[index].mail;
      console.log(data.Accounts.length);


 
  
      data.all.ads.$save(index).then(function(ref) {
     ref.key === data.all.ads[index].$id; // true
      data.Accounts.$add({"mail":data.all.ads[index].mail,"adId":id});

alert("Your post have been successfully submitted view your profile for updates");
$state.go("homepage.categories");
});
}).catch(); 
//data.fltr=data.ads;

});
}
}




function showItem($rootScope,content,menu)
{
 var data=this;
console.log($rootScope.content);
data.ads=$rootScope.content;
//data.all.ads=data;
console.log(data.ads);
}

function Welcome($rootScope,$firebaseArray,$firebaseAuth,gather,content,$state)
{
var w=this;
var  auth=$firebaseAuth();
//w.accounts=$firebaseArray(childref);
w.create=function(t)
{
  console.log(t)
  auth.$createUserWithEmailAndPassword(t.mail, t.password)
  .then(function(firebaseUser) {
  console.log("User " + firebaseUser.uid + " created successfully!");
  w.accounts.$add({"mail":t.mail});
  alert("New Account Created");
  $state.go("homepage.categories");
  }).catch(function(error) {
  console.error("Error: ", error);
  alert(error);

  });
}
w.signin=function(t)
{
console.log(t)
auth.$signInWithEmailAndPassword(t.mail,t.pass).then(function(firebaseUser) {
console.log("Signed in as:", firebaseUser.uid);
$state.go("homepage.categories");  
}).catch(function(error) {
  console.error("Authentication failed:", error);
alert(error);
});

}
w.logingoogle=function()

{
  auth.$signInWithPopup("google").then(function(result) {
  console.log(result);
  $rootScope.gather=result;
console.log($rootScope.gather);
$state.go("homepage.categories");
 // $location.path("/homepage");
  console.log("Signed in as:", result.user.uid);
  //console.log(result.user.email);
}).catch(function(error) {
  console.error("Authentication failed:", error);
alert(error);
});



}
w.loginfacebook=function()
{

auth.$signInWithPopup("facebook").then(function(result) {
console.log("Signed in as:", result.user.uid);
$rootScope.gather=result;
console.log($rootScope.gather);
$state.go("homepage.categories");
}).catch(function(error) {
console.error("Authentication failed:", error);
alert(error);
});



}
w.signupgoogle=function()
{

auth.$signInWithPopup("google").then(function(result) {
  console.log("Signed in as:", result.user.uid);
  $rootScope.gather=result;
  
  $state.go("homepage.categories");
}).catch(function(error) {
  console.error("Authentication failed:", error);
alert(error);
});
}
w.signupfacebook=function()
{

auth.$signInWithPopup("facebook").then(function(result) {
  console.log("Signed in as:", result.user.uid);
  $rootScope.gather=result;
  $state.go("homepage.categories");
}).catch(function(error) {
  console.error("Authentication failed:", error);
  alert(error);
});


}

w.logout=function()
{
  alert("Are you sure you want to logout");
  auth.$signOut();
  $state.go("login");
}
w.reset=function(m)
{
  auth.$sendPasswordResetEmail(m).then(function() {
  alert("Password reset email sent successfully!");
}).catch(function(error) {
 
  console.error("Error: ", error);
  alert(error);
 
});
}



}

function gather()
{
  return {};
}

function Proofile($firebaseObject,$firebaseArray,$rootScope,gather,myadds)
{
  var f=this;
  f.person={};
  var r=firebase.database().ref();
  var c=r.child("Ads");
  f.ads=$firebaseArray(c);
//console.log(ga)
  var rt=firebase.database().ref();
  var c=rt.child("Accounts");
  f.ads=$firebaseArray(c);
 f.person=$rootScope.gather;
f.mineadds=[];
f.mineadds=$rootScope.myadds;
console.log($rootScope.myadds);
console.log(f.mineadds);
console.log(f.mineadds.length);


//f.person.profilepic=$rootScope.gather.user.photoURL;
//f.person.name=$rootScope.gather.user.displayName;
//f.person.mail=$rootScope.gather.user.email;
console.log($rootScope.gather);
f.sadds=[];
for(var i=0;i<f.mineadds.length;i++)
{
  if(f.mineadds[i].mail==$rootScope.gather.user.mail);
  {
    f.sadds.push(f.mineadds[i]);
  }
}
console.log(f.sadds);

}
