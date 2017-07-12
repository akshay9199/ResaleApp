
angular.module("myapp",["ui.router","firebase"])
.controller("AdCtrl",AdCtrl)
.controller("showItem",showItem)
.controller("Welcome",Welcome)
.controller("Proofile",Proofile)
.service("content",content)
.service("gather",gather)
.service("menu",menu)
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
      .state("homepage",{
        url:"/homepage",
        templateUrl : "views/homepage.html",
        controller: "AdCtrl",
        controllerAs: "data",     
      })
      .state("forgotpassword",{
        url:"/forgot-password",
        templateUrl : "views/ftpd.html",
        controller: "Welcome",
        controllerAs: "w",     
      })

      .state("homepage.post",{
        url:"/post",
        templateUrl : "views/post.html",
        controller: "AdCtrl",
        controllerAs: "data", 
      })
      .state("homepage.viewitem",{
        url:"/view",
        templateUrl : "views/view.html",
        controller: "showItem",
        controllerAs: "data", 
      })
      .state("homepage.profile",{
        url:"/profile",
        templateUrl : "views/profile.html"
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
function menu()
{
  return {};
}

function AdCtrl($rootScope,$firebaseArray,$firebaseAuth,gather,$firebaseStorage,$firebaseObject,content,$state,menu)
{
  //console.log($rootScope.gather.displayName);
var data=this;
var rootRef=firebase.database().ref();
var childRef=rootRef.child("Ads");
var root=firebase.database().ref();
var child=root.child("Accounts");
data.Accounts=$firebaseArray(child);
data.ads=$firebaseArray(childRef);
data.ads=menu;

data.showcontent=function(t)
{
  console.log(t);
  $rootScope.content=t;
}
data.post=function(t)
{

  var file=document.getElementById("file").files[0];
  console.log(file);
data.ads.$add(t).then(function(ref)
 {
   var id = ref.key;
   console.log("added record with id " + id);
   var index=data.ads.$indexFor(id); 
   
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
       data.ads[index].dop=new Date().toDateString();      
      data.ads[index].imageUrl = link;
      //var pmail=data.ads[index].mail;
      console.log(data.Accounts.length);


 
  
      data.ads.$save(index).then(function(ref) {
     ref.key === data.ads[index].$id; // true
      data.Accounts.$add({"mail":data.ads[index].mail,"adId":id});

alert("Your post have been successfully submitted view your profile for updates");
$state.go("homepage.categories");


      });



}).catch(); 
data.fltr=data.ads;

 });
}
}




function showItem($rootScope,content,menu)
{
console.log($rootScope.content);
var d=$rootScope.content;
var data=this;
data.ads=menu;

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
  $state.go("homepage");
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
$state.go("homepage");  
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

$state.go("homepage");
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
$state.go("homepage");
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
  $state.go("homepage");
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
  $state.go("homepage");
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

/*

   f.name=$rootScope.gather.user.displayName;
   console.log(f.name);
   f.profilepic=$rootScope.gather.user.photoURL;
   console.log(f.profilepic);
   f.email=$rootScope.gather.user.email;
   console.log(f.email);
*/
function gather()
{
  return {};
}

function Proofile($firebaseObject,$firebaseArray,$rootScope,gather)
{
  var f=this;
  var r=firebase.database().ref();
  var c=r.child("Ads");
  f.ads=$firebaseArray(c);

  var rt=firebase.database().ref();
  var c=rt.child("Accounts");
  f.ads=$firebaseArray(c);

f.sadds={};
for(var i=1;i<=f.ads.length;f++)
{
  if(f.ads.mail==$rootscope.gather.user.mail);
  {
    f.sadds.$add(f.ads);
  }
}
f.delete=function(aa)
{
  alert("Are you willing to delete this post");


var item = list[$indexOf(aa)];
list.$remove(item).then(function(ref) {
ref.key === item.$id; // true

storage.$delete().then(function() {
console.log("successfully deleted!");
                                 });
                             });
  
}
}
