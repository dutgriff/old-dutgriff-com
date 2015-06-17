Vue.http.headers.common['X-CSRF-TOKEN'] = $('#csrf-token').attr('value');

var timepunchToday = new Vue({
  el: '#timepunch',

  data: {
    punches: [],
    tags: [],
    newPunch: {start: '', end: '', name: '', description: '', tags: ''},
    creatingTag: false,
    newTag: ''
  },

  computed: {
    startUtc: function() {
      return moment(this.newPunch.start, 'HH:mm').tz('America/Chicago').format('X');
    },
    endUtc: function() {
      return moment(this.newPunch.end, 'HH:mm').tz('America/Chicago').format('X');
    },
    errors: function() {
      return this.startUtc == "Invalid date" || this.endUtc == "Invalid date" || ! this.newPunch.name;
    }
  },

  ready: function () {
    this.fetchTags();
    this.fetchPunches();
  },

  methods: {
    fetchPunches: function () {
      this.$http.get('/api/v1/punch', function (response) {
        this.$set('punches', response.data);
      });
    },
    fetchTags: function () {
      this.$http.get('/api/v1/punchtags', function(response) {
        this.$set('tags', response.data);
      });
    },
    addPunch: function (e) {
      e.preventDefault();

      this.newPunch.start = this.startUtc;
      this.newPunch.end = this.endUtc;

      var punch = Vue.util.extend({}, this.newPunch);

      this.createPunch(punch);

      this.newPunch = {start: '', end: '', name: '', description: '', tags: ''};
      this.creatingTag = false;
      this.newTag = '';
    },
    createPunch: function(punch) {
      this.$http.post('api/v1/punch', punch, function(response){
        this.punches.push(response.data.item);
      });
    },
    createTag: function() {
      this.$http.post('api/v1/punchtags', { name: this.newTag }, function(response) {
        this.tags.push(response.data.item);
        this.creatingTag = false;
        this.newTag = '';
        this.newPunch.tags.push(response.data.item.id);
      });
    }
  },
  filters: {
    formatTime: function (unixTimestamp) {
      return moment(unixTimestamp, 'X').tz('America/Chicago').format('HH:mm');
    },
    toTagNames: function (ids) {
      var arr = [];
      var that = this;
      ids.forEach(function(id) {
        that.tags.forEach(function (tag) {
          if (tag.id === id) arr.push(tag.name);
        });
      });
      return arr;
    }
  }
});
