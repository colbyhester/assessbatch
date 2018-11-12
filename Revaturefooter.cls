<aura:component >
    <footer style="background-color:#474C55; height: 175px;" >
        <div class="container">
            <div class="row">
                <div class="col-sm-4 methods-of-contact">
                    <img class= "RevatureLogo" src="{!$Resource.RevatureLogo}" />
                    <div id= "contact-info">
                        <span class="glyphicon glyphicon-home" ></span>
                        <span>
                            <img class="icon" src= "{!$Resource.home}"/>  11730  Plaza America Drive
                            <br/>
                            Reston, VA 20190
                        </span>
                        <br/>
                        <span class="glyphicon glyphicon-earphone"></span>
                        <a href="tel:(703) 570-8282"><img class="icon" src= "{!$Resource.phone}">
                            </img>(703)570-8282</a><br/>
                        
                        <span class= "glyphicon glyphicon-envelope"></span>
                        <a href="mailto:info@revature.com"><img class="icon" src= "{!$Resource.email}" ></img>info@revature.com</a>
                        <br/>
                        
                        <span class="glyphicon glyphicon-link"></span>
                        <a target="_blank" href="http://revature.com"><img class="icon" src= "{!$Resource.link}"/>revature.com</a>
                        <br/>
                        <span class="copyright">
                            <img class="icon" src= "{!$Resource.copyright}" />
                            2018 Revature
                            
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</aura:component>