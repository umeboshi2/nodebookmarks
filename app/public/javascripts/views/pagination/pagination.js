/*
    @Module: App.Views.Pagination - renders pagination for bookmarks
    @Dependencies - jQuery
                  - Backbone 
                  - EJS 
                  - UnderScore
*/
(function(Backbone, views, Template, $) {
    "use strict";
    
    views.Pagination = Backbone.View.extend({
    
        el: $('#pagination'),
        
        
        paginationTemplate: new Template({url: '/javascripts/views/pagination/tmpl/pagination.ejs'}),
        
        
        data: {},
        
        
        events: {
            'click a.next': 'gotoNext',
            'click a.prev': 'gotoPrev'
        },
        

        /*
            @Public
            @Constructor: binds collection events
        */        
        initialize: function () {
            _.bindAll(this, 'render', 'changeCount', 'gotoNext', 'gotoPage', 'gotoPrev');
             
            this.collection.on('reset', this.render);
            this.collection.on('remove', function (model) {
                this.collection.removeFromOGModels(model.cid);
                this.render();
                views.Controls.render();
            }.bind(this)); 

            return this;            
         },
         
         
        /*
            @Public
            @Void: loads the pagination template and renders it.
        */          
        render: function () {
            this.data = this.collection.info();
            
            var html = this.paginationTemplate.render(this.data);
            
            this.$el.html(html).fadeIn();
            
            return this;
        },
         


        /*
            @Public
            @Void: loads the previous group of pages in the pagination view
            @Param: (Object) e - click event object
        */                   
        gotoPrev: function (e) {
            e.preventDefault();
            
            this.collection.previousGroup();
            this.render();
        },
         


        /*
            @Public
            @Void: loads the next group of available pages in the pagination view
            @Param: (Object) e - click event object
        */          
        gotoNext: function (e) {
            e.preventDefault();
             
            this.collection.nextGroup();
            this.render();
        },        
         


        /*
            @Public
            @Void: loads a page from the collection and call re-renders pagination
            @Param: (Number) page - the number of the page to go to
        */            
        gotoPage: function (page) {
            if (page > this.collection.info().totalPages) {
                return false;
            }
            
            this.collection.goTo(page);
        },
        

        /*
            @Public
            @Void: clears any filtered tag
        */         
        reset: function () {
            this.collection.resetFilteredModels();
            this.render();
        },



        /*
            @Public
            @Void: sets number of bookmarks to be displayed per page and reloads current page
            @Param: (Number) num - the number of bookmarks par page
        */         
        changeCount: function (num) {
            this.collection.setLimit(num);
            location.hash = '#pages/' + this.collection.currentPage;
        }
    });
}(Backbone, App.Views, EJS, jQuery));