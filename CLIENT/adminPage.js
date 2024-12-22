



$(document).ready(function() {
    // Initialize DataTable
    $('#usersTable').DataTable({
        responsive: true,
        pageLength: 10,
        order: [[0, 'asc']],
        language: {
            search: "Search users:",
            lengthMenu: "Show _MENU_ users per page",
            info: "Showing _START_ to _END_ of _TOTAL_ users"
        }
    });

    // Handle modal opening
    $('#wishlistModal').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget);
        const username = button.data('username');
        const items = button.data('items');
        
        const modal = $(this);
        modal.find('#modalUsername').text(username);
        
        const wishlistContainer = modal.find('#wishlistItems');
        wishlistContainer.empty();
        
        items.forEach(item => {
            wishlistContainer.append(`
                <div class="wishlist-item">
                    <div class="wishlist-item-name">${item.name}</div>
                    <div class="wishlist-item-date">
                        Added on: ${item.date_added} - Price: ${item.price}
                    </div>
                </div>
            `);
        });
    });
});



function ajaxCall(method, api, data, successCB, errorCB) {
    $.ajax({
      type: method,
      url: api,
      data: data,
      cache: false,
      contentType: "application/json",
      dataType: "json",
      success: successCB,
      error: errorCB,
    });
  }
  