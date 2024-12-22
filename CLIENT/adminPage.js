



$(document).ready(function() {
    // Initialize DataTable
    $('#usersTable').DataTable({
        paging: true,
        searching: true,
        info: false,
        lengthChange: false,
        pageLength: 5,
        
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
  